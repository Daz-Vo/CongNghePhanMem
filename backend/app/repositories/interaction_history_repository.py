from sqlalchemy.orm import Session
from app.models.interaction_history import InteractionHistory

def log_interaction_check(db: Session, user_id: int, drugs: list[str]) -> InteractionHistory:
    entry = InteractionHistory(
        user_id=user_id,
        drugs=", ".join(drugs)
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_user_interaction_count(db: Session, user_id: int) -> int:
    return db.query(InteractionHistory).filter(InteractionHistory.user_id == user_id).count()
