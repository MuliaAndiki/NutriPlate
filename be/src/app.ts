import Elysia from "elysia";
import cors from "@elysiajs/cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import posyanduRoutes from "./routes/posyanduRoutes";
import childRoutes from "./routes/childRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import notificationRoutes from "./routes/notificationRoutes";

class App {
  public app: Elysia;

  constructor() {
    this.app = new Elysia();
    this.middlewares();
    this.routes();
  }
  private routes(): void {
    this.app.get("/", () => "Hello Elysia! Bun js");
  }

  private middlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.group("/api", (api) =>
      api
        .use(authRoutes)
        .use(userRoutes)
        .use(posyanduRoutes)
        .use(childRoutes)
        .use(serviceRoutes)
        .use(notificationRoutes)
    );
  }
}

export default new App().app;
