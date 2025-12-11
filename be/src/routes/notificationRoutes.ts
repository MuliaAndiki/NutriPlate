import Elysia from "elysia";

class NotificationRouter {
  public notificationRoutes;
  constructor() {
    this.notificationRoutes = new Elysia({ prefix: "/notification" }).derive(
      () => ({
        json(data: any, status = 200) {
          return new Response(JSON.stringify(data), {
            status,
            headers: { "Content-Type": "application/json" },
          });
        },
      })
    );
    this.routes();
  }
  private routes() {
    //
  }
}

export default new NotificationRouter().notificationRoutes;
