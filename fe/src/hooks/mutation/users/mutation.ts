import { useAppNameSpace } from "@/hooks/useAppNameSpace";

class useUserMutation {
  private appNameSpace() {
    return useAppNameSpace;
  }
}

export default useUserMutation;
