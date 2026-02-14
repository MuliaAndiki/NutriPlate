import { IProgram } from "../schema/program.schema";
import { IProgress } from "../schema/progres.schema";
import { ChildPartial } from "./child.respone";

export interface ProgramResponse extends IProgram {
  posyanduId: string;
  userId: string;
}

export interface CreateProgramResponse {
  status: number;
  message: string;
  data: ProgramResponse;
}

export interface UpdateProgramResponse {
  status: number;
  message: string;
  data: ProgramResponse;
}

export interface GetProgramsResponse {
  status: number;
  message: string;
  data: ProgramResponse[];
}

export interface GetProgramByIDResponse {
  status: number;
  message: string;
  data: ProgramResponse & {
    progress?: ChildPartial[];
  };
}

export interface DeleteProgramResponse {
  status: number;
  message: string;
}

export interface ProgressResponse extends IProgress {
  subtask?: any[];
}

export interface CreateProgressResponse {
  status: number;
  message: string;
  data: ProgressResponse;
}

export interface GetChildInProgramResponse {
  status: number;
  message: string;
  data: ProgressResponse[];
}

export interface GetChildInProgramByIDResponse {
  status: number;
  message: string;
  data: ProgressResponse;
}

export interface CancelChildProgramResponse {
  status: number;
  message: string;
  data: ProgressResponse;
}

export interface GetHistoryChildProgramResponse {
  status: number;
  message: string;
  data: ProgressResponse[];
}
