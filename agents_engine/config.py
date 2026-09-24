import os
from pathlib import Path
from dotenv import load_dotenv

# تحديد مسار ملف .env.local في المجلد الرئيسي لمشروع AFRICONOMIST
base_dir = Path(__file__).resolve().parent.parent
env_file = base_dir / ".env.local"

if env_file.exists():
    load_dotenv(dotenv_path=env_file)
else:
    load_dotenv()

# استخراج المتغيرات الأساسية
MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "africonomist")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")
BING_API_KEY = os.getenv("BING_API_KEY", "")

def check_keys():
    """التحقق من توفر مفاتيح العمل الأساسية"""
    status = {
        "mongodb": bool(MONGODB_URI),
        "gemini": bool(GEMINI_API_KEY),
        "serper": bool(SERPER_API_KEY)
    }
    return status
