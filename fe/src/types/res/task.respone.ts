export interface TaskProgramResponse {
  id: string;
  title: string;
  description: string;
  isComplated: boolean;
  isBroadcast: boolean;
  mealType?: string;
  targetEnergyKcal?: number;
  targetProteinGram?: number;
  targetFatGram?: number;
  targetCarbGram?: number;
  targetFiberGram?: number;
  createdAt: string;
  updatedAt: string;
  progres: {
    child: {
      fullName: string;
    };
  };
}

export interface CreateTaskResponse {
  status: number;
  message: string;
  data: TaskProgramResponse;
}

export interface GetTaskForChildResponse {
  status: number;
  message: string;
  data: TaskProgramResponse[];
}

export interface UpdateTaskResponse {
  status: number;
  message: string;
  data: TaskProgramResponse;
}

export interface DeleteTaskResponse {
  status: number;
  message: string;
}

export interface GetTaskNotBroadCastResponse {
  status: number;
  message: string;
  data: TaskProgramResponse[];
}

export interface BroadcastTasksResponse {
  status: number;
  message: string;
  data?: TaskProgramResponse[];
}

export interface DoneTaskResponse {
  status: number;
  message: string;
  data: TaskProgramResponse;
}
