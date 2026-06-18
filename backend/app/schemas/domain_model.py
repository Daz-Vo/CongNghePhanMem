"""Các schema mô hình miền (Domain Models) Neo4j cho các phản hồi API."""

from typing import Optional
from pydantic import BaseModel


# ============ Schema cho Thuốc (Drug) ============
class DrugBase(BaseModel):
    name: str
    brand_name: Optional[str] = None
    generic_name: Optional[str] = None
    manufacturer: Optional[str] = None


class DrugCreate(DrugBase):
    pass


class DrugRead(DrugBase):
    node_id: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============ Schema cho Bệnh (Disease) ============
class DiseaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    icd_code: Optional[str] = None


class DiseaseCreate(DiseaseBase):
    pass


class DiseaseRead(DiseaseBase):
    node_id: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============ Schema cho Mối quan hệ/Tương tác ============
class DrugInteraction(BaseModel):
    """Đại diện cho mối quan hệ ĐIỀU TRỊ (TREATS) giữa Thuốc và Bệnh lý."""
    drug_name: str
    disease_name: str
    confidence: Optional[float] = None
    evidence_count: Optional[int] = None
