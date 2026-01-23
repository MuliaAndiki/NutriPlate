import { useProgram } from "../program/useProgram";
import { useAuth } from "./auths/useAuth";
import { useChild } from "./childs/useChild";
import { useFoodSummary } from "./foodsummary/useFoodSummary";
import { useMeasuremnet } from "./measurement/useMeasuremnet";
import { useNotification } from "./notafications/useNotifications";
import { usePosyandu } from "./posyandu/usePosyandu";
import { useProgramRegistrasion } from "./programregistration/useProgramRegistration";
import { useProgres } from "./progres/useProgres";
import { useServices } from "./services/useService";
import { useUsers } from "./users/useUsers";

export const useService = () => ({
  auth: useAuth(),
  posyandu: usePosyandu(),
  user: useUsers(),
  notafication: useNotification(),
  service: useServices(),
  child: useChild(),
  measuremnt: useMeasuremnet(),
  program: useProgram(),
  progres: useProgres(),
  foodSummary: useFoodSummary(),
  programRegistraion: useProgramRegistrasion(),
});

export default useService;
