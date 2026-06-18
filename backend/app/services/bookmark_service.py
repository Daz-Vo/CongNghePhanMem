from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories import bookmark_repository
from app.schemas.bookmark import BookmarkCreate, BookmarkResponse, BookmarkList

class BookmarkService:
    def add_bookmark(self, db: Session, user_id: int, bookmark_in: BookmarkCreate) -> BookmarkResponse:
        # Kiểm tra xem đã được bookmark chưa
        existing = bookmark_repository.get_bookmark_by_item(
            db, user_id, bookmark_in.item_type, bookmark_in.item_neo4j_id
        )
        if existing:
            return BookmarkResponse.model_validate(existing)
            
        db_bookmark = bookmark_repository.create_bookmark(db, user_id, bookmark_in)
        return BookmarkResponse.model_validate(db_bookmark)

    def get_bookmarks(self, db: Session, user_id: int, item_type: Optional[str] = None, limit: int = 20, skip: int = 0) -> BookmarkList:
        items = bookmark_repository.get_user_bookmarks(db, user_id, item_type, limit, skip)
        return BookmarkList(
            total=len(items),
            items=[BookmarkResponse.model_validate(item) for item in items]
        )

    def remove_bookmark(self, db: Session, bookmark_id: int, user_id: int) -> bool:
        return bookmark_repository.delete_bookmark(db, bookmark_id, user_id)

    def remove_bookmark_by_item(self, db: Session, user_id: int, item_type: str, item_neo4j_id: str) -> bool:
        existing = bookmark_repository.get_bookmark_by_item(db, user_id, item_type, item_neo4j_id)
        if existing:
            return bookmark_repository.delete_bookmark(db, existing.id, user_id)
        return False

bookmark_service = BookmarkService()
