from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .config.config import PROJECT_ROOT
from .routers.graphs import router as graphs_router
# from .routers.editor import router as editor_router

app = FastAPI(title="Graph Scheduler Demo")
app.include_router(graphs_router)
# app.include_router(editor_router)

STATIC_DIR = PROJECT_ROOT / "frontend/static"


# @app.get("/api/map_editor", response_class=FileResponse)
# async def get_editor():
#     """Open editor."""
#     return "./app/map_editor/index.html"

# ── Static files (must be last) ──────────────────────────────────────────────
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="app")
