import { useAppNameSpace } from "@/hooks/useAppNameSpace";

class useChildMutation {
  private get appNameSpace() {
    return useAppNameSpace;
  }
  // Public
}

export default useChildMutation;
