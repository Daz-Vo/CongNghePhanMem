import json
import os
from pathlib import Path
from app.core.config import settings

# DATA_DIR: Đường dẫn tới thư mục lưu trữ dữ liệu cấu hình cục bộ của hệ thống
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
# SETTINGS_FILE: Đường dẫn file JSON lưu trữ cấu hình mô hình AI (Gemini) động
SETTINGS_FILE = DATA_DIR / "ai_settings.json"

def get_ai_settings():
    """
    Mục đích: Lấy ra cấu hình cài đặt AI hiện tại đang được áp dụng.
    Cơ chế hoạt động: Đọc tệp cấu hình từ đĩa `ai_settings.json` nếu có. Nếu không tồn tại hoặc lỗi, trả về cấu hình mặc định từ biến môi trường của hệ thống.
    """
    if SETTINGS_FILE.exists():
        try:
            with open(SETTINGS_FILE, "r") as f:
                # data: Dữ liệu cấu hình đọc từ file JSON
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
    """
    Mục đích: Lưu thông tin cấu hình AI mới (bao gồm tên mô hình và khóa API) vào tệp lưu trữ động.
    Cơ chế hoạt động: Nhận thông tin cấu hình mới và ghi đè dạng JSON vào tệp `ai_settings.json`.
    """
    # model: Tên của mô hình AI muốn lưu cấu hình (ví dụ: gemini-1.5-flash)
    # api_key: Khóa API Gemini mới do quản trị viên cập nhật
    # data: Từ điển chứa các cặp khóa-giá trị cấu hình cần lưu
    data = {
        "model": model,
        "api_key": api_key
    }
    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f)
