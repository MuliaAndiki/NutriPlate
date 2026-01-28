import { useQueryClient } from "@tanstack/react-query";
import { Role } from "@/types/partial";

export function useAuthentic() {
  const qc = useQueryClient();

  return {
    token: qc.getQueryData<string>(["auth", "token"]),
    role: qc.getQueryData<Role>(["auth", "role"]),
    user: qc.getQueryData<any>(["auth", "me"]),
  };
}
