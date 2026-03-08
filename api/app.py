from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from contextlib import asynccontextmanager
from config.config import config 

MODEL_PATH = "models/1.1.pt"
RESULT_PATH = "models/results.csv"

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    config.load_model(
        model_path=MODEL_PATH,
        name="YOLOv8",
        version="best",
        results_csv_path=RESULT_PATH
    )
    yield
   

app = FastAPI(lifespan=lifespan)

import os
allowed_origins = os.environ.get("CORS_ORIGINS", "http://localhost:5000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.service import *
from routes.inference import *
from routes.models import *
