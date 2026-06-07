import logging
import json
import time
from typing import List, Tuple, Dict, Any
from sqlalchemy.orm import Session

from app.services.ner_service import ner_service
from app.services.llm_service import llm_service
from app.services.neo4j_service import neo4j_service
from app.models.chat import ChatHistory
from app.schemas.chat import ChatMessageResponse

logger = logging.getLogger(__name__)

class ChatService:
    """
    RAG Orchestrator:
    User Message -> Intent -> NER -> Neo4j -> Context -> LLM -> History -> API Response
    """

    def _detect_intent(self, message: str) -> str:
        message = message.lower()
        if any(word in message for word in ["tương tác", "dùng chung", "interaction", "together", "kết hợp"]):
            return "interaction_check"
        if any(word in message for word in ["tác dụng", "là gì", "what is", "effect", "công dụng"]):
            return "drug_info"
        if any(word in message for word in ["bệnh", "triệu chứng", "symptom", "disease", "đau", "sốt"]):
            return "disease_info"
        return "general_query"

    def _build_context(self, entities: Dict[str, List[str]]) -> Tuple[str, List[str], List[str]]:
        """
        Retrieves detailed data from Neo4j for detected entities and builds a JSON context.
        """
        context_data = []
        sources = []
        warnings = []
        
        drugs = entities.get("drugs", [])
        diseases = entities.get("diseases", [])

        # 1. Fetch Drug Details
        for drug_name in drugs:
            detail = neo4j_service.get_drug_detail(drug_name)
            if detail:
                drug_info = {
                    "type": "drug",
                    "name": detail.get("name"),
                    "generic_name": detail.get("generic_name"),
                    "indications": detail.get("indications"),
                    "dosage": detail.get("dosage"),
                    "warnings": detail.get("warnings"),
                    "ingredients": [i["name"] for i in detail.get("ingredients", [])],
                    "manufacturers": [m["name"] for m in detail.get("manufacturers", [])]
                }
                context_data.append(drug_info)
                if detail.get('warnings'):
                    warnings.append(f"Cảnh báo cho {drug_name}: {detail['warnings']}")
                sources.append(f"Neo4j: Drug({drug_name})")

        # 2. Fetch Disease & Symptom Details
        for disease_name in diseases:
            detail = neo4j_service.get_disease_symptoms(disease_name)
            if detail:
                disease_info = {
                    "type": "disease",
                    "name": detail.get("name"),
                    "description": detail.get("description"),
                    "symptoms": [s["name"] for s in detail.get("symptoms", [])]
                }
                context_data.append(disease_info)
                sources.append(f"Neo4j: Disease({disease_name})")

        # 3. Fetch Drug Interactions (if multiple drugs detected)
        if len(drugs) >= 2:
            interactions = neo4j_service.check_drug_interactions(drugs)
            if interactions:
                for inter in interactions:
                    context_data.append({
                        "type": "interaction",
                        "drug_1": inter.get("drug_1"),
                        "drug_2": inter.get("drug_2"),
                        "severity": inter.get("severity"),
                        "description": inter.get("description")
                    })
                    warnings.append(f"Tương tác ({inter.get('severity')}): {inter.get('drug_1')} và {inter.get('drug_2')}")
                sources.append("Neo4j: Drug Interactions")

        if context_data:
            # Sort sources and remove duplicates
            unique_sources = sorted(list(set(sources)))
            context_str = json.dumps(context_data, indent=2, ensure_ascii=False)
            return context_str, unique_sources, list(set(warnings))
        
        return "", [], []

    async def process_chat(self, db: Session, user_id: int, message: str) -> ChatMessageResponse:
        start_time = time.time()
        try:
            # 1. Language Detection
            lang = await llm_service.detect_language(message)
            logger.info(f"Detected language: {lang}")

            # 2. NER
            entities = ner_service.extract_entities(message)
            all_entity_names = entities.get("drugs", []) + entities.get("diseases", [])
            logger.info(f"NER Entities: {entities}")
            
            # 3. Intent & Context Retrieval
            intent = self._detect_intent(message)
            context, sources, warnings = self._build_context(entities)
            
            logger.info(f"RAG Context length: {len(context)} chars")
            
            # 4. LLM Generation
            # Prompt is now handled by llm_service with SYSTEM_PROMPT including language rules
            answer = await llm_service.generate_response(message, context)
            
            # 5. Update History
            chat_record = ChatHistory(
                user_id=user_id,
                message=message,
                response=answer,
                intent=intent,
                entities=",".join(all_entity_names)
            )
            db.add(chat_record)
            db.commit()
            
            process_time = time.time() - start_time
            logger.info(f"Chat processing completed in {process_time:.2f}s | Lang: {lang} | Source: {sources or 'LLM Knowledge'}")

            return ChatMessageResponse(
                answer=answer,
                entities=all_entity_names,
                sources=sources if sources else ["AI Base Knowledge"],
                warnings=warnings
            )
        except Exception as e:
            logger.exception(f"Error in chat processing: {e}")
            return ChatMessageResponse(
                answer="Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
                warnings=[str(e)],
                sources=["Error Fallback"]
            )

    def get_user_history(self, db: Session, user_id: int, limit: int = 20) -> List[Any]:
        return db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.created_at.desc()).limit(limit).all()

chat_service = ChatService()

