"use client";
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface FoodCameraProps {
  onCapture: (photoBlob: Blob, weight: number) => void;
  onCancel: () => void;
  isLoading?: boolean;
  flowType: "normal" | "task";
  taskName?: string;
}

const FoodCamera: React.FC<FoodCameraProps> = ({
  onCapture,
  onCancel,
  isLoading = false,
  flowType,
  taskName,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCapture = async () => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setPhoto(imageSrc);
          setError("");
        }
      } catch (err) {
        setError("Gagal mengambil foto");
      }
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setWeight("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!photo || !weight) {
      setError("Berat makanan harus diisi");
      return;
    }

    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Berat harus angka positif (gram)");
      return;
    }

    const response = await fetch(photo);
    const blob = await response.blob();

    onCapture(blob, weightNum);
  };

  if (photo) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-start p-4 space-y-4 bg-background">
        <div className="w-full flex items-center justify-between">
          <ChevronLeft
            onClick={handleReset}
            className="cursor-pointer hover:bg-secondary rounded-lg p-1"
            width={36}
            height={36}
          />
          <h1 className="text-xl font-bold">Preview Foto</h1>
          <div className="w-9" />
        </div>

        <div className="w-full relative">
          <img
            src={photo}
            alt="Preview"
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        <div className="w-full space-y-2">
          <label className="text-sm font-semibold">Berat Makanan (gram)</label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Contoh: 300"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <span className="text-sm font-medium">g</span>
          </div>
        </div>

        {flowType === "task" && taskName && (
          <div className="w-full bg-primary/10 rounded-lg p-3 border border-primary">
            <p className="text-sm font-medium text-primary">
              📋 Task: {taskName}
            </p>
          </div>
        )}

        {error && (
          <div className="w-full bg-destructive/10 rounded-lg p-3 border border-destructive">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="w-full flex items-center space-x-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Ulang
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isLoading || !weight}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-4 space-y-4 bg-background">
      <div className="w-full flex items-center justify-between">
        <ChevronLeft
          onClick={onCancel}
          className="cursor-pointer hover:bg-secondary rounded-lg p-1"
          width={36}
          height={36}
        />
        <h1 className="text-xl font-bold">
          {flowType === "task" ? "Scan untuk Task" : "Scan Makanan"}
        </h1>
        <div className="w-9" />
      </div>

      {flowType === "task" && taskName && (
        <div className="w-full bg-primary/10 rounded-lg p-3 border border-primary">
          <p className="text-sm font-medium text-primary">
            📋 Task: {taskName}
          </p>
        </div>
      )}

      <div className="w-full relative rounded-lg overflow-hidden bg-black">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment",
          }}
          className="w-full h-80"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-primary rounded-lg opacity-50" />
        </div>
      </div>

      <div className="w-full bg-secondary/50 rounded-lg p-3 space-y-1">
        <p className="text-sm font-medium">📸 Petunjuk:</p>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>✓ Posisikan makanan di tengah area persegi</li>
          <li>✓ Pastikan pencahayaan cukup</li>
          <li>✓ Ambil foto dari atas untuk hasil terbaik</li>
        </ul>
      </div>

      {error && (
        <div className="w-full bg-destructive/10 rounded-lg p-3 border border-destructive">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        size="lg"
        className="w-full h-14 text-lg"
        onClick={handleCapture}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-5 w-5" />
            Processing...
          </>
        ) : (
          " Ambil Foto"
        )}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={onCancel}
        disabled={isLoading}
      >
        Batal
      </Button>
    </div>
  );
};

export default FoodCamera;
