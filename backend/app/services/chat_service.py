import logging
import json
import time
from typing import List, Tuple, Dict, Any, Optional
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

    def _build_context(self, entities: Dict[str, List[str]], intent: str = "general_query") -> Tuple[str, List[str], List[str]]:
        """
        Retrieves detailed subgraph from Neo4j for detected entities in a single batch.
        """
        drugs = entities.get("drugs", [])
        diseases = entities.get("diseases", [])
        
        if not drugs and not diseases:
            return "", [], []

        # Graph-First lookup: batch all entities into one subgraph query
        context_data = neo4j_service.get_subgraph_context(drugs, diseases)
        
        sources = []
        warnings = []
        
        for item in context_data:
            name = item.get("name")
            label = item.get("type", "unknown").capitalize()
            sources.append(f"Neo4j: {label}({name})")
            
            if item.get("warnings"):
                warnings.append(f"Cảnh báo cho {name}: {item['warnings']}")
                
            # If multiple drugs, check for specific interactions in the items
            if intent == "interaction_check" and item.get("type") == "drug":
                # Ensure interactions are highlighted if that's the intent
                for inter in item.get("interactions", []):
                    warnings.append(f"Tương tác ({inter.get('severity')}): {name} và {inter.get('name')}")

        if context_data:
            unique_sources = sorted(list(set(sources)))
            context_str = json.dumps(context_data, indent=2, ensure_ascii=False)
            return context_str, unique_sources, list(set(warnings))
        
        return "", [], []

    async def process_chat(self, db: Session, user_id: Optional[int], message: str) -> ChatMessageResponse:
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
            context, sources, warnings = self._build_context(entities, intent)
            
            logger.info(f"RAG Context length: {len(context)} chars")
            
            # 4. LLM Generation
            # Prompt is now handled by llm_service with SYSTEM_PROMPT including language rules
            answer = await llm_service.generate_response(message, context)
            
            # 5. Update History
            if user_id is not None:
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

    def get_chat_detail(self, db: Session, chat_id: int, user_id: int) -> Optional[ChatHistory]:
        return db.query(ChatHistory).filter(ChatHistory.id == chat_id, ChatHistory.user_id == user_id).first()

    def get_all_chat_logs(
        self, db: Session, user_id: Optional[int] = None, limit: int = 20, skip: int = 0
    ) -> List[ChatHistory]:
        """Admin: Retrieve all chat logs."""
        query = db.query(ChatHistory)
        if user_id:
            query = query.filter(ChatHistory.user_id == user_id)
        return query.order_by(ChatHistory.created_at.desc()).offset(skip).limit(limit).all()

    def get_chat_logs_count(self, db: Session, user_id: Optional[int] = None) -> int:
        """Admin: Get total count of chat logs."""
        query = db.query(ChatHistory)
        if user_id:
            query = query.filter(ChatHistory.user_id == user_id)
        return query.count()

    def get_chat_topic_stats(self, db: Session) -> Dict[str, Any]:
        """Admin: Get stats for chat topics."""
        from sqlalchemy import func
        stats = db.query(ChatHistory.intent, func.count(ChatHistory.id)).group_by(ChatHistory.intent).all()
        topic_counts = {item[0] or "unknown": item[1] for item in stats}
        total = sum(topic_counts.values()) or 1
        
        return {
            "counts": topic_counts,
            "total": sum(topic_counts.values())
        }

chat_service = ChatService()

