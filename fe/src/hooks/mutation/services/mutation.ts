import { useAppNameSpace } from "@/hooks/useAppNameSpace";

class useServiceMutation {
  private get appNameSpace() {
    return useAppNameSpace;
  }
  // more logic
}

export default useServiceMutation;
