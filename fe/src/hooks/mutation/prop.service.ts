import { useProgram } from "../program/useProgram";
import { useAuth } from "./auths/useAuth";
import { useChild } from "./childs/useChild";
import { useFoodIntake } from "./foodintake/useFoodIntake";
import { useFoodSummary } from "./foodsummary/useFoodSummary";
import { useKaderRegistration } from "./kaderregistration/useKaderRegistration";
import { useMeasuremnet } from "./measurement/useMeasuremnet";
import { useNotification } from "./notafications/useNotifications";
import { usePosyandu } from "./posyandu/usePosyandu";
import { useProgramRegistrasion } from "./programregistration/useProgramRegistration";
import { useProgres } from "./progres/useProgres";
import { useServices } from "./services/useService";
import { useTask } from "./task/useTask";
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
  task: useTask(),
  foodIntake: useFoodIntake(),
  registerKader: useKaderRegistration(),
});

export default useService;
