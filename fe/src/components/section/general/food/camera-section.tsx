"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DailySummaryResponse, FoodIntakeResponse } from "@/types/res";
import FoodScanResult from "@/components/card/food/food-result";

interface FoodCameraSectionProps {
  service: {
    foodIntake: {
      createFoodIntake: any;
    };
  };
  state: {
    childId: string;
    iotId?: string;
    flowType: "normal" | "task";
    taskName?: string;
    iotWeight?: number;
    dailySummary: DailySummaryResponse | null;
    isLoading: boolean;
  };
  actions: {
    onSuccess: () => void;
    onCancel: () => void;
  };
}

const FoodCameraSection = ({
  service,
  state: {
    childId,
    iotId,
    flowType,
    taskName,
    iotWeight = 0,
    dailySummary,
    isLoading,
  },
  actions,
}: FoodCameraSectionProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<"camera" | "preview" | "result">("camera");
  const [responseFoodIntake, setResponseFoodIntake] = useState<
    FoodIntakeResponse | any
  >();

  const createFoodIntake = service.foodIntake.createFoodIntake;

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("imageSrc", imageSrc);
    if (!imageSrc) {
      setError("Gagal mengambil foto");
      return;
    }
    setPhoto(imageSrc);
    setError("");
  };

  const handleReset = () => {
    setPhoto(null);
    setWeight("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!photo) {
      setError("Foto belum diambil");
      return;
    }

    const finalWeight = iotWeight || Number(weight);
    if (!finalWeight || finalWeight <= 0) {
      setError("Berat makanan tidak valid");
      return;
    }

    try {
      const res = await fetch(photo);
      const blob = await res.blob();

      createFoodIntake.mutate(
        {
          childId,
          iotId,
          photoBlob: blob,
          totalWeightGram: finalWeight,
        },
        {
          onSuccess: (res: any) => {
            setResponseFoodIntake(res.data);
            setMode("result");
          },
          onError: (err: any) => {
            setError(err?.message || "Gagal menyimpan data makanan");
          },
        },
      );
    } catch {
      setError("Gagal memproses foto");
    }
  };

  if (mode === "result" && responseFoodIntake && dailySummary) {
    return (
      <section className="w-full min-h-screen flex items-center justify-start flex-col overflow-x-hidden relative p-2 space-y-2">
        <FoodScanResult
          data={responseFoodIntake}
          dailySummary={dailySummary}
          isLoading={isLoading}
          onSuccess={actions.onSuccess}
          onBack={() => {
            setMode("camera");
            setPhoto(null);
            setWeight("");
            setResponseFoodIntake(undefined);
          }}
        />
      </section>
    );
  }

  if (photo) {
    return (
      <section className="w-full min-h-screen fixed inset-0 flex flex-col p-4 bg-background">
        <div className="flex items-center justify-between mb-4">
          <ChevronLeft
            onClick={handleReset}
            className="cursor-pointer p-1 rounded-lg hover:bg-secondary"
            width={36}
            height={36}
          />
          <h1 className="text-lg font-bold">Konfirmasi Makanan</h1>
          <div className="w-9" />
        </div>

        <img
          src={photo}
          alt="Preview"
          className="w-full h-1/2 object-contain rounded-lg mb-4"
        />

        {iotWeight > 0 ? (
          <div className="bg-primary/10 p-4 rounded-lg border mb-4">
            <p className="font-semibold text-primary">
              ⚖️ Berat dari Timbangan: {iotWeight} g
            </p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold">
              Berat Makanan (gram)
            </label>
            <Input
              type="number"
              placeholder="Contoh: 300"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setError("");
              }}
            />
          </div>
        )}

        {flowType === "task" && taskName && (
          <div className="bg-primary/10 p-3 rounded-lg border mb-4">
            <p className="text-sm font-medium text-primary">Task: {taskName}</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive p-3 rounded-lg mb-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
            disabled={createFoodIntake.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Ulang
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={createFoodIntake.isPending}
          >
            {createFoodIntake.isPending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen fixed inset-0 flex flex-col p-4 bg-background">
      <div className="flex items-center justify-between mb-4">
        <ChevronLeft
          onClick={actions.onCancel}
          className="cursor-pointer p-1 rounded-lg hover:bg-secondary"
          width={36}
          height={36}
        />
        <h1 className="text-lg font-bold">
          {flowType === "task" ? "Scan untuk Task" : "Scan Makanan"}
        </h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden bg-black mb-4">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "environment",
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-primary rounded-lg opacity-50" />
        </div>
      </div>

      {iotWeight > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <p className="font-semibold text-emerald-800">
            ⚖️ Berat Timbangan: {iotWeight} g
          </p>
        </div>
      )}

      <Button size="lg" className="h-14" onClick={handleCapture}>
        Ambil Foto
      </Button>

      <Button variant="outline" className="mt-2" onClick={actions.onCancel}>
        Batal
      </Button>
    </section>
  );
};

export default FoodCameraSection;
