import Elysia from "elysia";
import ChildController from "@/controllers/ChildController";
import { AppContext } from "@/contex/appContex";
import { requireRole, verifyToken } from "@/middlewares/auth";

class ChildRoutes {
  public childRoutes;
  constructor() {
    this.childRoutes = new Elysia({ prefix: "/child" }).derive(() => ({
      json(data: any, status = 200) {
        return new Response(JSON.stringify(data), {
          status,
          headers: { "Content-Type": "application/json" },
        });
      },
    }));
    this.routes();
  }

  private routes() {
    this.childRoutes.get("/", (c: AppContext) => ChildController.getChild(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.childRoutes.get(
      "/:id",
      (c: AppContext) => ChildController.getChildByID(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      }
    );
    this.childRoutes.post(
      "/",
      (c: AppContext) => ChildController.createChild(c),
      {
        beforeHandle: [
          verifyToken().beforeHandle,
          requireRole(["PARENT"]).beforeHandle,
        ],
      }
    );
  }
}

export default new ChildRoutes().childRoutes;
