
from fastapi import File, UploadFile, HTTPException
from app import app
import numpy as np
import cv2
from io import BytesIO
from config.config import config




@app.post("/detect")
async def detect_food(image: UploadFile = File(...)):
    config.load_model()
    
    try:
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
      
        img_height, img_width = img.shape[:2]
        img_area = img_height * img_width
        
      
        results = config.model(img, conf=0.5, imgsz=640, verbose=False)
        result = results[0]
        
      
        detections = []
        for box in result.boxes:
            
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            class_id = int(box.cls[0].item())
            confidence = box.conf[0].item()
            class_name = config.model.names[class_id]
            
            
            bbox_area = (x2 - x1) * (y2 - y1)
            area_ratio = bbox_area / img_area
            
            detections.append({
                "class": class_name,
                "class_id": class_id,
                "confidence": round(confidence, 3),
                "bounding_box": {
                    "x1": round(x1),
                    "y1": round(y1),
                    "x2": round(x2),
                    "y2": round(y2)
                },
                "area_ratio": round(area_ratio, 4)
            })
        
        return {
            "success": True,
            "detections": detections,
            "image_size": {
                "width": img_width,
                "height": img_height
            },
            "model_info": {
                "name": "YOLOv8s",
                "version": "dietary_yolov8s",
                "threshold": 0.5
            }
        }
    
    except Exception as e:
        print(f" Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

