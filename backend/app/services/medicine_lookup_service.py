"""
Medicine lookup service.
Orchestrates medicine-related operations between the repository and schemas.
"""

import logging
from typing import Any

from app.repositories.medicine_repository import medicine_repository

logger = logging.getLogger(__name__)


class MedicineLookupService:
    """Service for medicine information retrieval and management."""

    def __init__(self):
        self._repository = medicine_repository

    def get_medicine_detail(self, name: str) -> dict[str, Any] | None:
        """Get full details of a medicine."""
        return self._repository.get_medicine_by_name(name)

    def search_medicines(self, query: str, limit: int = 10, skip: int = 0) -> dict[str, Any]:
        """Search for medicines with pagination metadata."""
        items = self._repository.search_medicines(query, limit, skip)
        # In a real app we might want more complex pagination
        return {
            "query": query,
            "limit": limit,
            "skip": skip,
            "total": len(items),
            "items": items
        }

    def get_medicines_by_disease(
        self, disease_name: str, limit: int = 10, skip: int = 0
    ) -> dict[str, Any]:
        """Get medicines treating a specific disease."""
        items = self._repository.get_medicines_by_disease(disease_name, limit, skip)
        return {
            "disease_name": disease_name,
            "limit": limit,
            "skip": skip,
            "total": len(items),
            "items": items
        }

    def get_medicine_ingredients(self, name: str) -> list[dict[str, Any]]:
        """Get ingredients for a medicine."""
        return self._repository.get_medicine_ingredients(name)

    def create_medicine(self, data: dict[str, Any]) -> dict[str, Any] | None:
        """Create a new medicine (Admin)."""
        return self._repository.create_medicine(data)

    def update_medicine(self, name: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Update existing medicine (Admin)."""
        return self._repository.update_medicine(name, data)

    def delete_medicine(self, name: str) -> bool:
        """Delete medicine (Admin)."""
        return self._repository.delete_medicine(name)


medicine_lookup_service = MedicineLookupService()
