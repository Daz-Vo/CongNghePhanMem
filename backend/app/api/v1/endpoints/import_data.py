from fastapi import APIRouter, HTTPException, Query
import logging

# from app.services.import_openfda_service import import_openfda_drugs
# from app.services.neo4j_service import neo4j_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/import", tags=["import"])


@router.post("/openfda")
def import_openfda(
    limit: int = Query(10, ge=1, le=1000, description="Number of drugs to import"),
    skip: int = Query(0, ge=0, description="Number of drugs to skip")
):
    """
    Import drugs from openFDA API into Neo4j.
    
    Features:
    - Imports drug nodes with name, brand name, generic name, dosage, warnings, etc.
    - Creates Ingredient nodes and CONTAINS relationships
    - Creates Manufacturer nodes and MADE_BY relationships
    - Extracts diseases from indications and creates TREATS relationships
    - Handles retry on transient API failures
    - Rate limiting and proper pagination
    
    Parameters:
    - **limit**: Number of drugs to import (max 1000)
    - **skip**: Number of drugs to skip for pagination
    
    Returns:
    - imported: Number of drugs imported in this request
    - total_drugs: Total drug nodes in Neo4j
    - total_diseases: Total disease nodes created
    """
    raise HTTPException(
        status_code=410,
        detail="OpenFDA import has been disabled. Use CSV seed instead."
    )
