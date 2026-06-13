from fastapi import APIRouter, HTTPException, Query
import logging

from app.schemas.graph import GraphResponse
from app.services.neo4j_service import neo4j_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/neo4j", tags=["neo4j"])


@router.get("/test")
def test_neo4j_connection():
    try:
        result = neo4j_service.verify_connectivity()
        if not result:
            raise Exception("connectivity check failed")

        # Ensure a simple Test node exists and return it
        try:
            repo = neo4j_service._repository
            # ensure driver exists
            repo._ensure_driver()
            # use a session directly to perform write/read
            with repo._driver.session() as session:
                session.run("MERGE (t:Test {name: $name})", name="hello")
                result = session.run(
                    "MATCH (t:Test {name: $name}) RETURN t.name AS name", name="hello"
                )
                rows = [r.data() for r in result]
                node = rows[0] if rows else None
        except Exception:
            node = None

        return {"status": "connected", "result": result, "node": node}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Neo4j connection failed: {str(e)}")


@router.get("/stats")
def get_neo4j_stats():
    """Get statistics about Neo4j data."""
    stats = neo4j_service.get_graph_stats()
    return stats


@router.get("/graph", response_model=GraphResponse)
def get_graph_data(limit: int = Query(100, ge=1, le=1000)):
    """Get all nodes and relationships for graph visualization."""
    return neo4j_service.get_graph_data(limit=limit)
