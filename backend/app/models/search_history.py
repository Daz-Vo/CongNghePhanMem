from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    query_text = Column(String, index=True, nullable=False)
    item_type = Column(String, nullable=True)  # "Medicine" or "Disease"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
