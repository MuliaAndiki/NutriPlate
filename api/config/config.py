import os
from ultralytics import YOLO
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "preprocessing", "runs", "train", "dietary_yolov8s", "weights", "best.pt")

model = None

def load_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise Exception(f"Model not found at {MODEL_PATH}")
        try:
            model = YOLO(MODEL_PATH)
            print(f" YOLOv8s model loaded: {MODEL_PATH}")
        except Exception as e:
            print(f" Failed to load model: {e}")
            raise