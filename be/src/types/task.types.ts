export interface ITask {
  id: string;
  progressId: string;
  title: string;
  description: string;
  isComplated: boolean;
}

export type PickCreateTask = Pick<ITask, 'title' | 'description' | 'isComplated'>;
export type PickTaskProgresID = Pick<ITask, 'progressId'>;
export type PickTaskID = Pick<ITask, 'id'>;
