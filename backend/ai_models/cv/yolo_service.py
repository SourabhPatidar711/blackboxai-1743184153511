import cv2
import numpy as np
from ultralytics import YOLO
from typing import Dict, Any

class YOLOService:
    def __init__(self):
        # Load pre-trained YOLOv8 model
        self.model = YOLO('yolov8n.pt')
        self.disaster_classes = {
            0: 'fire',
            1: 'flood', 
            2: 'earthquake_damage',
            3: 'collapsed_building'
        }

    def analyze_image(self, image_data: str) -> Dict[str, Any]:
        """Analyze image for disaster detection"""
        try:
            # Convert base64 image to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Run inference
            results = self.model(img)
            
            # Process results
            detections = []
            for result in results:
                for box in result.boxes:
                    class_id = int(box.cls)
                    if class_id in self.disaster_classes:
                        detections.append({
                            'type': self.disaster_classes[class_id],
                            'confidence': float(box.conf),
                            'location': {
                                'x1': float(box.xyxy[0][0]),
                                'y1': float(box.xyxy[0][1]),
                                'x2': float(box.xyxy[0][2]),
                                'y2': float(box.xyxy[0][3])
                            }
                        })
            
            return {
                'success': True,
                'detections': detections,
                'processed_at': datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Singleton service instance
yolo_service = YOLOService()