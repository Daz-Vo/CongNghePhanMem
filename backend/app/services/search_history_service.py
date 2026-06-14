from sqlalchemy.orm import Session
from app.repositories import search_history_repository
from app.schemas.search_history import SearchHistoryCreate, SearchHistoryResponse, SearchHistoryList

class SearchHistoryService:
    def add_search_entry(self, db: Session, user_id: int, search_in: SearchHistoryCreate) -> SearchHistoryResponse:
        db_search = search_history_repository.create_search_history(db, user_id, search_in)
        return SearchHistoryResponse.model_validate(db_search)

    def get_history(self, db: Session, user_id: int, limit: int = 20, skip: int = 0) -> SearchHistoryList:
        history = search_history_repository.get_user_search_history(db, user_id, limit, skip)
        total = search_history_repository.get_user_search_history_count(db, user_id)
        return SearchHistoryList(
            total=total,
            items=[SearchHistoryResponse.model_validate(item) for item in history]
        )

    def clear_history(self, db: Session, user_id: int) -> bool:
        search_history_repository.delete_user_search_history(db, user_id)
        return True

    def delete_history_entry(self, db: Session, user_id: int, entry_id: int) -> bool:
        return search_history_repository.delete_search_history_entry(db, user_id, entry_id)

    def get_top_searches(self, db: Session, item_type: str = "medicine", limit: int = 5):
        return search_history_repository.get_top_searches(db, item_type, limit)

search_history_service = SearchHistoryService()
