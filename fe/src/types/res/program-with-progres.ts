import { ChildPartial } from "../partial";
import { IProgram } from "../schema/program.schema";

export interface ProgramRespone extends IProgram {
  progress: ChildPartial[];
}

export interface GetProgramWithProgressResponse {
  status: number;
  message: string;
  data: ProgramRespone;
}
