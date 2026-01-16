from ultralytics import YOLO
from threading import Lock
import csv
from pathlib import Path

class ModelConfig:
    def __init__(self):
        self.model = None
        self.model_name = None
        self.model_version = None
        self.model_path = None
        self.metrics = None
        self.lock = Lock()

    def load_model(
        self,
        model_path: str,
        name: str,
        version: str,
        results_csv_path: str | None = None,
    ):
        with self.lock:
            self.model = YOLO(model_path)
            self.model_path = model_path
            self.model_name = name
            self.model_version = version
            self.metrics = self._load_metrics_from_csv(results_csv_path)

    def _load_metrics_from_csv(self, path: str | None):
        if not path:
            return None

        csv_path = Path(path)
        if not csv_path.exists():
            return None

        with csv_path.open("r") as f:
            rows = list(csv.DictReader(f))
            if not rows:
                return None

            last = rows[-1]
            return {
                "precision": float(last.get("metrics/precision(B)", 0)),
                "recall": float(last.get("metrics/recall(B)", 0)),
                "mAP50": float(last.get("metrics/mAP50(B)", 0)),
                "mAP50_95": float(last.get("metrics/mAP50-95(B)", 0)),
            }

    def is_loaded(self) -> bool:
        return self.model is not None


config = ModelConfig()
