import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import AxiosClient from "@/utils/axios.client";

interface FormCreateTask {
  title: string;
  description: string;
  [key: string]: any;
}

class TaskApi {
  public async createTask(
    payload: FormCreateTask,
    id: string,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/task/${id}`, payload);
    return res.data;
  }

  public async getTaskForChild(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/task");
    return res.data;
  }

  public async updateTask(
    id: string,
    payload: FormCreateTask,
  ): Promise<TResponse<any>> {
    const res = await AxiosClient.put(`/api/task/${id}`, payload);
    return res.data;
  }

  public async deleteTask(id: string): Promise<TResponse<any>> {
    const res = await AxiosClient.delete(`/api/task/${id}`);
    return res.data;
  }

  public async getTaskNotBroadCast(): Promise<TResponse<any>> {
    const res = await AxiosClient.get("/api/task/notBroadcast");
    return res.data;
  }

  public async broadcastTasks(payload: any): Promise<TResponse<any>> {
    const res = await AxiosClient.patch("/api/task/broadcast", payload);
    return res.data;
  }

  public async doneTask(id: string, payload?: any): Promise<TResponse<any>> {
    const res = await AxiosClient.post(`/api/task/task/${id}`, payload || {});
    return res.data;
  }
}

export default TaskApi;
