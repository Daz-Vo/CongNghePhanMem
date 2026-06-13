from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Bookmark(Base):
    __tablename__ = "bookmark"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String, index=True, nullable=False)  # "Medicine" or "Disease"
    item_neo4j_id = Column(String, index=True, nullable=False) # Store the name or Neo4j ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
