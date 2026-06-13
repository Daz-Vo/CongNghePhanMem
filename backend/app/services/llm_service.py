import logging
import httpx
import asyncio
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """
    Service for interacting with LLM providers (OpenAI, Gemini, Groq).
    Includes safety rules, retry logic, and fallback mechanisms for medical AI.
    """

    SYSTEM_PROMPT = (
        "You are an expert Doctor of Pharmacy. Your goal is to provide accurate, "
        "evidence-based information using the provided Knowledge Graph context.\n\n"
        "STRICT RULES:\n"
        "1. LANGUAGE CONSISTENCY: You MUST respond in the EXACT same language as the user's question. "
        "If the user asks in Vietnamese, respond in Vietnamese. If English, respond in English. "
        "This applies to Spanish, French, German, and any other language.\n"
        "2. PRIORITIZE CONTEXT: Base your answer primarily on the provided Knowledge Graph (Neo4j) context. "
        "The context might be in English; you MUST translate and interpret it into the user's language.\n"
        "3. MEDICAL DISCLAIMER: Every response MUST end with a disclaimer in the SAME language as the response:\n"
        "   - Vietnamese: 'Lưu ý: Đây không phải là lời khuyên y tế chuyên môn. Vui lòng tham khảo ý kiến bác sĩ.'\n"
        "   - English: 'Note: This is not professional medical advice. Please consult a doctor.'\n"
        "   - Spanish: 'Nota: Este no es un consejo médico profesional. Por favor, consulte a un médico.'\n"
        "   - French: 'Note : Ceci ne constitue pas un avis médical professionnel. Veuillez consulter un médecin.'\n"
        "   - German: 'Hinweis: Dies ist kein professioneller medizinischer Rat. Bitte konsultieren Sie einen Arzt.'\n"
        "4. NO FINAL DIAGNOSIS: Never give a definitive diagnosis.\n"
        "5. TERMINOLOGY: Keep drug names and active ingredients accurate, using standard medical terms in the target language.\n"
        "6. NO HALLUCINATION: If the provided Knowledge Graph context does not contain enough information, "
        "clearly state that the information is unavailable instead of inventing medical facts, treatments, dosages, "
        "side effects, interactions, diseases, or recommendations.\n"
    )

    def __init__(self):
        self.headers = {"Content-Type": "application/json"}

    async def detect_language(self, text: str) -> str:
        """
        Detect the language of the input text using Gemini.
        Returns the language name or ISO code.
        """
        if not text:
            return "Unknown"

        prompt = f"Detect the language of the following text and return ONLY the language name (e.g., 'Vietnamese', 'English', 'Spanish', 'French', 'German'):\n\n{text}"

        try:
            # Short-circuit call for speed
            result = await self._call_gemini(prompt, "Language Detection Task")
            return result.strip() if result else "Unknown"
        except Exception as e:
            logger.error(f"Language detection failed: {e}")
            return "English"

    async def _call_gemini(self, prompt: str, context: str) -> Optional[str]:
        """Call Google Gemini API (v1beta) with the provided prompt and context.

        Uses settings.GEMINI_MODEL (default: gemini-2.5-flash).
        The official endpoint format:
          POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=API_KEY
        """
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not configured – skipping Gemini call")
            return None

        # Read model from dedicated GEMINI_MODEL setting (never hardcoded)
        model = settings.GEMINI_MODEL
        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent?key={settings.GEMINI_API_KEY}"
        )

        logger.debug(f"[Gemini] Model : {model}")
        logger.debug(
            f"[Gemini] Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=***"
        )
        logger.info(
            f"[Gemini] Calling model={model}, prompt_len={len(prompt)}, context_len={len(context)}"
        )

        # Build payload – system_instruction is supported from v1beta
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                f"KNOWLEDGE GRAPH CONTEXT (JSON):\n{context}\n\n"
                                f"USER QUESTION: {prompt}"
                            )
                        }
                    ],
                }
            ],
            "system_instruction": {"parts": [{"text": self.SYSTEM_PROMPT}]},
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.8,
                "topK": 40,
                "maxOutputTokens": 8192,
            },
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    endpoint,
                    json=payload,
                    timeout=settings.LLM_TIMEOUT_SECONDS,
                )

                # ── Debug: always log HTTP status ──────────────────────────
                logger.debug(f"[Gemini] HTTP status: {response.status_code}")

                if response.status_code != 200:
                    try:
                        error_body = response.json()
                    except Exception:
                        error_body = response.text
                    logger.error(
                        f"[Gemini] Non-200 response – status={response.status_code}, "
                        f"model={model}, body={error_body}"
                    )
                    return None

                data = response.json()

                # Check for prompt-level blocking (safety filters, etc.)
                if data.get("promptFeedback", {}).get("blockReason"):
                    block_reason = data["promptFeedback"]["blockReason"]
                    logger.warning(f"[Gemini] Prompt blocked – reason: {block_reason}")
                    return None

                candidates = data.get("candidates")
                if not candidates:
                    logger.error(f"[Gemini] Response has no candidates: {data}")
                    return None

                # Handle finish reasons other than STOP
                finish_reason = candidates[0].get("finishReason", "STOP")
                if finish_reason not in ("STOP", "MAX_TOKENS"):
                    logger.warning(
                        f"[Gemini] Unexpected finishReason={finish_reason} for model={model}"
                    )

                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts or "text" not in parts[0]:
                    logger.error(f"[Gemini] No text part in response: {data}")
                    return None

                text = parts[0]["text"]
                logger.info(
                    f"[Gemini] Success – model={model}, response_len={len(text)}"
                )
                return text

            except httpx.TimeoutException:
                logger.error(
                    f"[Gemini] Request timed out after {settings.LLM_TIMEOUT_SECONDS}s "
                    f"(model={model})"
                )
                return None
            except Exception as e:
                logger.error(
                    f"[Gemini] Unexpected error (model={model}): {e}", exc_info=True
                )
                return None

    def _get_safe_fallback_answer(self, context: str) -> str:
        """Standard fallback answer if Gemini fails."""
        disclaimer = "\n\nLưu ý: Đây không phải là lời khuyên y tế chuyên môn. Vui lòng tham khảo ý kiến bác sĩ."

        if not context:
            return (
                "Rất tiếc, tôi hiện không thể kết nối với dịch vụ trí tuệ nhân tạo "
                "và không tìm thấy thông tin cụ thể trong cơ sở dữ liệu nội bộ. "
                "Vui lòng thử lại sau hoặc hỏi bác sĩ của bạn." + disclaimer
            )

        return (
            "Hiện tại dịch vụ AI đang bận, sau đây là thông tin thô từ cơ sở dữ liệu y khoa của chúng tôi:\n\n"
            f"{context}\n\n"
            "Vui lòng tự tra cứu kỹ hoặc hỏi ý kiến chuyên môn từ bác sĩ." + disclaimer
        )

    async def generate_response(self, prompt: str, context: str) -> str:
        """
        Generate response using Gemini with retries and fallback logic.
        """
        max_retries = settings.LLM_MAX_RETRIES
        response = None

        for attempt in range(max_retries):
            try:
                response = await self._call_gemini(prompt, context)
                if response:
                    break

                logger.warning(f"Attempt {attempt + 1} failed for Gemini, retrying...")
                await asyncio.sleep(1 * (attempt + 1))  # Exponential backoff
            except Exception as e:
                logger.error(f"Error in generate_response attempt {attempt + 1}: {e}")

        if response:
            return response

        return self._get_safe_fallback_answer(context)


llm_service = LLMService()
