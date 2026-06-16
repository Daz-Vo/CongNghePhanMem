from typing import List
from sqlalchemy.orm import Session
from app.models.search_history import SearchHistory
from app.schemas.search_history import SearchHistoryCreate

def create_search_history(db: Session, user_id: int, search_in: SearchHistoryCreate) -> SearchHistory:
    db_search = SearchHistory(
        user_id=user_id,
        query_text=search_in.query_text,
        item_type=search_in.item_type
    )
    db.add(db_search)
    db.commit()
    db.refresh(db_search)
    return db_search

def get_user_search_history(db: Session, user_id: int, limit: int = 20, skip: int = 0) -> List[SearchHistory]:
    return db.query(SearchHistory)\
        .filter(SearchHistory.user_id == user_id)\
        .order_by(SearchHistory.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_user_search_history_count(db: Session, user_id: int) -> int:
    return db.query(SearchHistory).filter(SearchHistory.user_id == user_id).count()

def delete_user_search_history(db: Session, user_id: int) -> int:
    result = db.query(SearchHistory).filter(SearchHistory.user_id == user_id).delete()
    db.commit()
    return result

def delete_search_history_entry(db: Session, user_id: int, entry_id: int) -> bool:
    result = db.query(SearchHistory).filter(
        SearchHistory.id == entry_id, 
        SearchHistory.user_id == user_id
    ).delete()
    db.commit()
    return result > 0

def get_top_searches(db: Session, item_type: str = "medicine", limit: int = 5):
    from sqlalchemy import func
    results = db.query(SearchHistory.query_text, func.count(SearchHistory.id).label("count"))\
        .filter(SearchHistory.item_type == item_type)\
        .group_by(SearchHistory.query_text)\
        .order_by(func.count(SearchHistory.id).desc())\
        .limit(limit)\
        .all()
    return [{"name": r[0], "count": r[1]} for r in results]
