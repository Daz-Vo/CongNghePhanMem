from fastapi import APIRouter, HTTPException, Query
import logging

from app.services.import_openfda_service import import_openfda_drugs
from app.services.neo4j_service import neo4j_service

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
    logger.info(f"Starting openFDA import: limit={limit}, skip={skip}")
    try:
        imported = import_openfda_drugs(limit=limit, skip=skip)
        stats = neo4j_service.get_graph_stats()
        total_drugs = stats.get("label_counts", {}).get("Drug", 0)
        total_diseases = stats.get("label_counts", {}).get("Disease", 0)
        
        logger.info(f"✓ Import completed: imported={imported}, total_drugs={total_drugs}")
        return {
            "success": True,
            "imported": imported,
            "total_drugs_in_neo4j": total_drugs,
            "total_diseases_in_neo4j": total_diseases,
            "source": "openFDA drug label API",
            "pagination": {
                "skip": skip,
                "limit": limit,
            },
        }
    except Exception as e:
        logger.exception(f"✗ Import failed: {e}")
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
