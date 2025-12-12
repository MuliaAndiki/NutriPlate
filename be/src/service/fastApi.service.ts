import { AxiosService } from "@/utils/axios";
import { cleanNaNValues } from "@/utils/cleanValues";

class FastApi {
  private AxiosHit;
  private isAxiosError;
  constructor() {
    const { AxiosHit, isAxiosError } = AxiosService();
    this.AxiosHit = AxiosHit;
    this.isAxiosError = isAxiosError;
  }
  public async getFastApi() {
    try {
      const res = await this.AxiosHit.get("/");
      let result = res.data;
      if (typeof result === "string") {
        result = JSON.parse(result);
      }
      const clean = cleanNaNValues(result);
      return clean;
    } catch (error) {
      if (this.isAxiosError(error)) {
        console.error("Axios Error", error.response?.data);
        return {
          success: false,
          message: error.response?.data?.message || "Axios error",
          data: null,
        };
      }
      console.error(error);
      return {
        status: 500,
        message: "server internal error",
        error: error instanceof Error ? error.message : error,
      };
    }
  }
}

export default new FastApi();
