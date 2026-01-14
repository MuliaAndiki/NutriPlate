
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()
origins =  [
    "http://localhost:5000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.checkpoint import *
from routes.inference import *