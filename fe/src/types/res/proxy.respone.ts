export interface FastApiStatusResponse {
  status: number;
  message: string;
  data?: any;
}

export interface HealthCheckResponse {
  status: number;
  message: string;
  data?: {
    status: "healthy" | "unhealthy";
    timestamp: Date;
  };
}
