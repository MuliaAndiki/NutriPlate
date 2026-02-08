import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { FormCreateMeasurement } from "@/types/form";
import { useMutation } from "@tanstack/react-query";

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
    onSuccess: () => {
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
