import Api from "@/services/props.module";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";

export function useCreateFoodIntake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      photoBlob: Blob;
      childId: string;
      totalWeightGram: number;
      iotId?: string;
    }) => {
      const formData = new FormData();
      formData.append("image", payload.photoBlob, "food.jpg");
      formData.append("childId", payload.childId);
      formData.append("totalWeightGram", String(payload.totalWeightGram));
      if (payload.iotId) {
        formData.append("iotId", payload.iotId);
      }

      return Api.FoodIntake.createFoodIntake(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: cacheKey.foodIntake.list(),
      });
    },
  });
}
