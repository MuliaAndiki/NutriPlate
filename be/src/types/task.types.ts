export interface ITask {
  id: string;
  progressId: string;
  title: string;
  isBroadcast: boolean;
  description: string;
  isComplated: boolean;
}

export type PickCreateTask = Pick<ITask, 'title' | 'description' | 'isComplated' | 'isBroadcast'>;
export type PickTaskProgresID = Pick<ITask, 'progressId'>;
export type PickTaskID = Pick<ITask, 'id'>;
