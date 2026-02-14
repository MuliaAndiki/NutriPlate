import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateMeasurement } from "@/types/form";
import { useMutation } from "@tanstack/react-query";
import { cacheKey } from "@/configs/cache.config";

export function useCreateMeasuremnt() {
  const namespace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormCreateMeasurement; id: string }
  >({
    mutationFn: ({ id, payload }) =>
      Api.Measurement.createMeasurementChild(payload, id),
    //invalid key
    onSuccess: (_res, { id }) => {
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.measurement.byChild(id),
      });
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.evaluate.byChild(id),
      });
      namespace.alert.toast({
        title: "succesfully",
        message: "succes create measurent for this child",
        icon: "success",
      });
    },
    onError: (err) => {
      console.log(err);
      namespace.alert.toast({
        title: "failed",
        message: "failed create measurent for this child",
        icon: "error",
      });
    },
  });
}

export function useUpdateMeasurement() {
  const namespace = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { payload: FormCreateMeasurement; id: string }
  >({
    mutationFn: ({ payload, id }) =>
      Api.Measurement.updateMeasuremntController(payload, id),
    onSuccess: (res, { id }) => {
      const childId = res?.data?.childId;
      if (childId) {
        namespace.queryClient.invalidateQueries({
          queryKey: cacheKey.measurement.byChild(childId),
        });
        namespace.queryClient.invalidateQueries({
          queryKey: cacheKey.evaluate.byChild(childId),
        });
      }
      namespace.queryClient.invalidateQueries({
        queryKey: cacheKey.measurement.byID(id),
      });
      namespace.alert.toast({
        title: "succesfully",
        message: "succes update measurent for this child",
        icon: "success",
      });
    },
    onError: (err) => {
      console.log(err);
      namespace.alert.toast({
        title: "failed",
        message: "failed update measurent for this child",
        icon: "error",
      });
    },
  });
}
