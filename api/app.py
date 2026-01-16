from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from config.config import config 

MODEL_PATH = "/home/muliaandiki/project/NutriPlate/api/models/1.0.pt"
RESULT_PATH = "/home/muliaandiki/project/NutriPlate/api/models/results.csv"
app = FastAPI()

origins = [
    "http://localhost:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def load_model_on_startup():
    config.load_model(
        model_path=MODEL_PATH,
        name="YOLOv8",
        version="best",
        results_csv_path=RESULT_PATH
    )

from routes.service import *
from routes.inference import *
from routes.models import *
