from app import app
from config.config import config

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "food-detection",
        "model_loaded": config.model is not None
    }

@app.get("/models/current")
async def current_model():
    if not config.is_loaded():
        return {
            "loaded": False,
        }

    return {
        "isActive": True,
        "name": config.model_name,
        "version": config.model_version,
        "modelPath": config.model_path,
        "metrics": config.metrics
    }

@app.post('/models')
async def post_models_version():
    if not config.is_loaded():
        return {
            "loaded": False
        }
    
    return {
        "isActive": True,
        "name": config.model_name,
        "version": config.model_version,
        "modelPath": config.model_path,
        "metrics": config.metrics
    }