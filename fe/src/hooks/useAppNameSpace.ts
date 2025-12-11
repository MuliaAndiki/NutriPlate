import { useAlert } from "./useAlert/costum-alert";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslate } from "./useTranslate";
import { useAppDispatch } from "./dispatch/dispatch";

export function useAppNameSpace() {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { t } = useTranslate();
  const dispatch = useAppDispatch();
  return { alert, queryClient, t, dispatch };
}
