import AuhtApi from "@/services/module/auth/auth.service";

import ChildApi from "./module/child/child.service";
import NotificationApi from "./module/notifications/notification.service";
import PosyanduApi from "./module/posyandu/posyandu.service";
import ProgramApi from "./module/program/program.service";
import ProgresApi from "./module/progres/progres.service";
import UserApi from "./module/user/user.service";
import MeasurementApi from "./module/measurement/measurement.service";
import FoodSummaryApi from "./module/foodSummary/foodSummary.service";
import FoodIntakeApi from "./module/foodIntake/foodIntake.service";
import TaskApi from "./module/task/task.service";
import IotApi from "./module/iot/iot.service";
import ModelsApi from "./module/models/models.service";
import KaderRegistrationApi from "./module/kaderRegistration/kaderRegistration.service";
import ProgramRegistrationApi from "./module/programRegistration/programRegistration.service";
import ProxyApi from "./module/proxy/proxy.service";

class Api {
  static Auth = new AuhtApi();
  static User = new UserApi();
  static Child = new ChildApi();
  static Posyandu = new PosyanduApi();
  static Notification = new NotificationApi();
  static Program = new ProgramApi();
  static Progres = new ProgresApi();
  static Measurement = new MeasurementApi();
  static FoodSummary = new FoodSummaryApi();
  static FoodIntake = new FoodIntakeApi();
  static Task = new TaskApi();
  static Iot = new IotApi();
  static Models = new ModelsApi();
  static KaderRegistration = new KaderRegistrationApi();
  static ProgramRegistration = new ProgramRegistrationApi();
  static Proxy = new ProxyApi();
}

export default Api;
