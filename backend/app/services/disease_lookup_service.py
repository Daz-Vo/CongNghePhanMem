"""
Disease lookup service.
Handles disease searches and retrievals.
"""

import logging
from typing import Any

from app.repositories.disease_repository import disease_repository
from app.schemas.disease import DiseaseResponse, DiseaseDetailResponse, DiseaseSearchResponse

logger = logging.getLogger(__name__)


class DiseaseLookupService:
    """Service for disease lookups and searches."""

    def __init__(self):
        self._repository = disease_repository

    def search_diseases(self, query: str, limit: int = 10, skip: int = 0) -> DiseaseSearchResponse:
        """
        Search for diseases by name or description.
        Returns a DiseaseSearchResponse with matching diseases.
        """
        logger.info(f"Searching diseases with query: '{query}', limit: {limit}, skip: {skip}")

        try:
            results = self._repository.search_diseases(query, limit=limit, skip=skip)

            diseases = [
                DiseaseResponse(
                    name=disease.get("name", ""),
                    description=disease.get("description"),
                )
                for disease in results
            ]

            logger.info(f"Found {len(diseases)} diseases matching query '{query}'")
            return DiseaseSearchResponse(total=len(diseases), limit=limit, items=diseases)

        except Exception as exc:
            logger.error(f"Error searching diseases: {exc}")
            return DiseaseSearchResponse(total=0, limit=limit, items=[])

    def get_disease_detail(self, disease_name: str) -> DiseaseDetailResponse | None:
        """
        Get full details of a disease including treating drugs.
        Returns DiseaseDetailResponse or None if not found.
        """
        logger.info(f"Fetching details for disease: '{disease_name}'")

        try:
            disease = self._repository.get_disease_by_name(disease_name)
            if not disease:
                logger.warning(f"Disease '{disease_name}' not found")
                return None

            # Transform symptoms
            symptoms = [
                {"name": s.get("name"), "description": s.get("description")}
                for s in (disease.get("symptoms") or [])
                if s and s.get("name")
            ]

            detail = DiseaseDetailResponse(
                name=disease.get("name", ""),
                description=disease.get("description"),
                symptoms=symptoms,
                treating_medicines=disease.get("treating_medicines") or []
            )

            logger.info(f"Successfully fetched details for disease '{disease_name}'")
            return detail

        except Exception as exc:
            logger.error(f"Error getting disease detail for '{disease_name}': {exc}")
            return None

    def get_treating_medicines(
        self, disease_name: str, limit: int = 10, skip: int = 0
    ) -> list[dict[str, Any]]:
        """
        Get medicines that treat a specific disease.
        """
        logger.info(f"Fetching treating medicines for disease: '{disease_name}', limit: {limit}, skip: {skip}")

        try:
            medicines = self._repository.get_treating_medicines(disease_name, limit=limit, skip=skip)
            logger.info(f"Found {len(medicines)} treating medicines for disease '{disease_name}'")
            return medicines

        except Exception as exc:
            logger.error(
                f"Error getting treating medicines for disease '{disease_name}': {exc}"
            )
            return []


    def delete_disease(self, name: str) -> bool:
        """Admin: Delete a disease."""
        return self._repository.delete_disease(name)

    def create_disease(self, data: dict[str, Any]) -> dict[str, Any] | None:
        """Admin: Create a new disease."""
        return self._repository.create_disease(data)

    def update_disease(self, name: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Admin: Update a disease."""
        return self._repository.update_disease(name, data)


disease_lookup_service = DiseaseLookupService()
