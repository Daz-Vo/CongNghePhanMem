import json
import os
from pathlib import Path
from app.core.config import settings

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
SETTINGS_FILE = DATA_DIR / "ai_settings.json"

def get_ai_settings():
    if SETTINGS_FILE.exists():
        try:
            with open(SETTINGS_FILE, "r") as f:
                data = json.load(f)
                return {
                    "model": data.get("model", settings.GEMINI_MODEL),
                    "api_key": data.get("api_key", settings.GEMINI_API_KEY) or ""
                }
        except Exception:
            pass
    return {
        "model": settings.GEMINI_MODEL,
        "api_key": settings.GEMINI_API_KEY or ""
    }

def save_ai_settings(model: str, api_key: str):
    data = {
        "model": model,
        "api_key": api_key
    }
    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f)
