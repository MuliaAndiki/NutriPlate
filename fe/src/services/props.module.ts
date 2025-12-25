import AuhtApi from "@/services/module/auth/auth.service";

import ChildApi from "./module/child/child.service";
import NotificationApi from "./module/notifications/notification.service";
import PosyanduApi from "./module/posyandu/posyandu.service";
import ProgramApi from "./module/program/program.service";
import ProgresApi from "./module/progres/progres.service";
import UserApi from "./module/user/user.service";

class Api {
  static Auth = new AuhtApi();
  static User = new UserApi();
  static Child = new ChildApi();
  static Posyandu = new PosyanduApi();
  static Notification = new NotificationApi();
  static Program = new ProgramApi();
  static Progres = new ProgresApi();
}

export default Api;
