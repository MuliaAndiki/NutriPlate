from fastapi import UploadFile, File, HTTPException, Form
from pathlib import Path
from app import app
from config.config import config
import shutil

MODEL_DIR = Path("app/models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

@app.post("/models/upload")
async def upload_model(
    file: UploadFile = File(...),
    name: str = Form(...),
    version: str = Form(...),
):

    if not file.filename.endswith(".pt"):
        raise HTTPException(status_code=400, detail="Only .pt models allowed")

    model_path = MODEL_DIR / file.filename

    try:
        with model_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    
        config.load_model(
            model_path=str(model_path),
            name=name,
            version=version,
        )

        return {
            "success": True,
            "message": "Model uploaded & activated",
            "model": {
                "name": name,
                "version": version,
                "path": str(model_path),
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))