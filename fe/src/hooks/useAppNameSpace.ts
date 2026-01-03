import { useQueryClient } from "@tanstack/react-query";
import { usePathname,useRouter } from "next/navigation";

import { useAppDispatch } from "./dispatch/dispatch";
import { useAlert } from "./useAlert/costum-alert";
import { useTranslate } from "./useTranslate";

export function useAppNameSpace() {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { t } = useTranslate();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  return { alert, queryClient, t, dispatch, router, pathname };
}
