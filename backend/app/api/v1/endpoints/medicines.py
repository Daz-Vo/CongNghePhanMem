from fastapi import APIRouter, HTTPException, Query, Path, status
import logging

from app.services.medicine_lookup_service import medicine_lookup_service
from app.schemas.medicine import (
    MedicineSearchResponse, 
    MedicineDetailResponse
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/medicines", tags=["medicines"])

@router.get("/search", response_model=MedicineSearchResponse)
def search_medicines(
    q: str = Query(..., min_length=1, max_length=255, description="Search query"),
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    """Search for medicines."""
    return medicine_lookup_service.search_medicines(query=q, limit=limit, skip=skip)

@router.get("/{name}/detail", response_model=MedicineDetailResponse)
def get_medicine_detail(
    name: str = Path(..., description="Medicine name"),
):
    """Get detailed information about a specific medicine."""
    medicine = medicine_lookup_service.get_medicine_detail(name)
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medicine '{name}' not found",
        )
    return medicine

# Alias for spec compliance: GET /medicines/{id}
@router.get("/{id}", response_model=MedicineDetailResponse)
def get_medicine_by_id(
    id: str = Path(..., description="Medicine ID (using name as ID)"),
):
    """Compatibility alias: Get medicine by name (used as ID)."""
    return get_medicine_detail(id)
