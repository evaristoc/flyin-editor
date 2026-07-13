from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

DATA_DIR = Path(os.getenv("DATA_DIR", PROJECT_ROOT / "data"))
GRAPHS_DIR = DATA_DIR / "maps"
SOLUTIONS_DIR = DATA_DIR / "solutions"

print(SOLUTIONS_DIR)