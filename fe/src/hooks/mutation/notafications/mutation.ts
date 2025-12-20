import { useAppNameSpace } from "@/hooks/useAppNameSpace";

class useNotationMutation {
  private get appNameSpace() {
    return useAppNameSpace;
  }
  //   Public
}

export default useNotationMutation;
