import useAuthMutation from "./auths/mutation";
import { useAuthData } from "./auths/query";
import useChildMutation from "./childs/mutation";
import { useChildsData } from "./childs/query";
import useNotationMutation from "./notafications/mutation";
import { useNotaficationsData } from "./notafications/query";
import usePosyanduMutation from "./posyandu/mutation";
import { usePosyanduData } from "./posyandu/query";
import useServiceMutation from "./services/mutation";
import { useServiceData } from "./services/query";
import useUserMutation from "./users/mutation";
import { useUserData } from "./users/query";

export const useService = () => ({
  auth: {
    mutation: new useAuthMutation(),
    query: useAuthData,
  },
  posyandu: {
    mutation: new usePosyanduMutation(),
    query: usePosyanduData,
  },
  user: {
    mutation: new useUserMutation(),
    query: useUserData,
  },
  notafication: {
    mutation: new useNotationMutation(),
    query: useNotaficationsData,
  },
  service: {
    mutation: new useServiceMutation(),
    query: useServiceData,
  },
  child: {
    mutation: new useChildMutation(),
    query: useChildsData,
  },
});

export default useService;
