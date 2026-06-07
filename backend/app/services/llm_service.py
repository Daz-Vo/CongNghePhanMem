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
        "You are an expert Multilingual Medical AI Assistant. Your goal is to provide accurate, "
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
        "   - Spanish: 'Nota: Đây no es un consejo médico profesional. Por favor, consulte a un médico.'\n"
        "   - French: 'Note: Ceci n'est pas một lời khuyên y tế chuyên môn. Veuillez consulter un médecin.'\n"
        "   - German: 'Hinweis: Dies ist kein professioneller medizinischer Rat. Bitte konsultieren Sie einen Arzt.'\n"
        "4. NO FINAL DIAGNOSIS: Never give a definitive diagnosis.\n"
        "5. TERMINOLOGY: Keep drug names and active ingredients accurate, using standard medical terms in the target language."
    )

    def __init__(self):
        self.headers = {
            "Content-Type": "application/json"
        }

    async def detect_language(self, text: str) -> str:
        """
        Detect the language of the input text using the primary LLM provider.
        Returns the language name or ISO code.
        """
        if not text:
            return "Unknown"
            
        provider = settings.LLM_PROVIDER
        if provider == "none":
            if settings.GEMINI_API_KEY: provider = "gemini"
            elif settings.OPENAI_API_KEY: provider = "openai"
        
        prompt = f"Detect the language of the following text and return ONLY the language name (e.g., 'Vietnamese', 'English', 'Spanish', 'French', 'German'):\n\n{text}"
        
        try:
            # We use a very low temperature for detection
            if provider == "gemini":
                # Short-circuit call for speed
                result = await self._call_gemini(prompt, "Language Detection Task")
                return result.strip() if result else "Unknown"
            # Fallback to English if detection fails
            return "English"
        except Exception as e:
            logger.error(f"Language detection failed: {e}")
            return "Unknown"

    async def _call_openai(self, prompt: str, context: str) -> Optional[str]:
        if not settings.OPENAI_API_KEY:
            return None
        
        url = "https://api.openai.com/v1/chat/completions"
        headers = {**self.headers, "Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
        payload = {
            "model": settings.LLM_MODEL or "gpt-4-turbo",
            "messages": [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {prompt}"}
            ],
            "temperature": 0.2
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url, 
                    json=payload, 
                    headers=headers,
                    timeout=settings.LLM_TIMEOUT_SECONDS
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except Exception as e:
                logger.error(f"OpenAI API error: {e}")
                return None

    async def _call_gemini(self, prompt: str, context: str) -> Optional[str]:
        """Call Google Gemini API with the provided prompt and context."""
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not configured")
            return None
        
        model = settings.LLM_MODEL or "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
        
        # Structure the prompt for Gemini
        full_content = (
            f"{self.SYSTEM_PROMPT}\n\n"
            f"KNOWLEDGE GRAPH CONTEXT (JSON):\n{context}\n\n"
            f"USER QUESTION: {prompt}"
        )
        
        payload = {
            "contents": [{
                "parts": [{"text": full_content}]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.8,
                "topK": 40
            }
        }
        
        logger.info(f"Calling Gemini ({model}) for prompt length: {len(prompt)}")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url, 
                    json=payload, 
                    timeout=settings.LLM_TIMEOUT_SECONDS
                )
                response.raise_for_status()
                data = response.json()
                
                if "candidates" in data and data["candidates"]:
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return text
                
                logger.error(f"Gemini response missing candidates: {data}")
                return None
            except Exception as e:
                logger.error(f"Gemini API error: {e}")
                return None

    async def _call_groq(self, prompt: str, context: str) -> Optional[str]:
        if not settings.GROQ_API_KEY:
            return None
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {**self.headers, "Authorization": f"Bearer {settings.GROQ_API_KEY}"}
        payload = {
            "model": settings.LLM_MODEL or "mixtral-8x7b-32768",
            "messages": [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {prompt}"}
            ]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url, 
                    json=payload, 
                    headers=headers,
                    timeout=settings.LLM_TIMEOUT_SECONDS
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            except Exception as e:
                logger.error(f"Groq API error: {e}")
                return None

    def _get_safe_fallback_answer(self, context: str) -> str:
        """Standard fallback answer if all AI providers fail."""
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
        Generate response with provider selection, retries, and fallback logic.
        """
        provider = settings.LLM_PROVIDER
        if provider == "none":
            # Auto-detect provider if not set but key exists
            if settings.GEMINI_API_KEY:
                provider = "gemini"
            elif settings.OPENAI_API_KEY:
                provider = "openai"
                
        max_retries = settings.LLM_MAX_RETRIES
        response = None
        
        for attempt in range(max_retries):
            try:
                if provider == "openai":
                    response = await self._call_openai(prompt, context)
                elif provider == "gemini":
                    response = await self._call_gemini(prompt, context)
                elif provider == "groq":
                    response = await self._call_groq(prompt, context)
                
                if response:
                    break
                
                logger.warning(f"Attempt {attempt + 1} failed for {provider}, retrying...")
                await asyncio.sleep(1 * (attempt + 1)) # Exponential backoff
            except Exception as e:
                logger.error(f"Error in generate_response attempt {attempt+1}: {e}")

        # Fallback to other providers if primary failed
        if not response:
            logger.info("Primary provider failed all retries, trying fallbacks...")
            if provider != "gemini" and settings.GEMINI_API_KEY:
                response = await self._call_gemini(prompt, context)
            elif provider != "openai" and settings.OPENAI_API_KEY:
                response = await self._call_openai(prompt, context)

        if response:
            return response
        
        return self._get_safe_fallback_answer(context)

llm_service = LLMService()

