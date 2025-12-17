import { useQueryClient } from "@tanstack/react-query";

import { useAppDispatch } from "./dispatch/dispatch";
import { useAlert } from "./useAlert/costum-alert";
import { useTranslate } from "./useTranslate";

export function useAppNameSpace() {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { t } = useTranslate();
  const dispatch = useAppDispatch();
  return { alert, queryClient, t, dispatch };
}
