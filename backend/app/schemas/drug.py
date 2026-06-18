"""
API Schemas cho Thuốc (Drug).
"""

from pydantic import BaseModel, Field
from typing import Optional


class DrugSearchRequest(BaseModel):
    """Yêu cầu tìm kiếm thuốc."""

    query: str = Field(..., min_length=1, max_length=255)
    limit: int = Field(10, ge=1, le=100)


class DrugIngredient(BaseModel):
    """Thành phần trong thuốc."""

    name: str
    description: Optional[str] = None


class DrugManufacturer(BaseModel):
    """Thông tin nhà sản xuất."""

    name: str
    country: Optional[str] = None


class DrugInteraction(BaseModel):
    """Tương tác thuốc."""

    name: str
    severity: str


class DrugResponse(BaseModel):
    """Mô hình phản hồi thông tin thuốc."""

    id: Optional[str] = None
    name: str
    generic_name: Optional[str] = None
    purpose: Optional[str] = None
    indications: Optional[str] = None
    warnings: Optional[str] = None
    dosage: Optional[str] = None


class DrugDetailResponse(DrugResponse):
    """Thông tin chi tiết thuốc cùng với các mối quan hệ."""

    ingredients: list[DrugIngredient] = Field(default_factory=list)
    manufacturers: list[DrugManufacturer] = Field(default_factory=list)
    interactions: list[DrugInteraction] = Field(default_factory=list)
    treated_diseases: list[str] = Field(default_factory=list)


class DrugSearchResponse(BaseModel):
    """Phản hồi tìm kiếm thuốc."""

    total: int
    limit: int
    items: list[DrugResponse]


class ErrorResponse(BaseModel):
    """Phản hồi lỗi."""

    detail: str
    status_code: int
