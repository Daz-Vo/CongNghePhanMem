"""
Interaction API schemas.
"""

from pydantic import BaseModel, Field
from typing import List


class InteractionCheckRequest(BaseModel):
    """Request to check interactions between drugs."""

    drug_names: List[str] = Field(..., min_items=2, max_items=10)


class InteractionResult(BaseModel):
    """Interaction result between two drugs."""

    drug_1: str
    drug_2: str
    has_interaction: bool
    severity: str | None = None
    description: str | None = None


class InteractionCheckResponse(BaseModel):
    """Response for interaction check."""

    results: List[InteractionResult] = Field(default_factory=list)

class InteractionDetailResponse(BaseModel):
    """Detailed interaction between two specific drugs."""
    drug_1: str
    drug_2: str
    has_interaction: bool
    severity: str | None = None
    description: str | None = None
    message: str | None = None

class InteractionListResponse(BaseModel):
    """List of all interactions for a specific drug."""
    drug_name: str
    interactions: List[InteractionResult] = Field(default_factory=list)
    total: int
    message: str | None = None

class InteractionSummaryResponse(BaseModel):
    """Summary of drug combination analysis."""
    drug_names: List[str]
    interactions: List[InteractionResult]
    is_safe: bool
    warnings: List[str] = Field(default_factory=list)
    summary: str
