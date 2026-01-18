import { ChildPartial } from "../partial";
import { IProgram } from "../schema/program.schema";

export interface ProgramRespone extends IProgram {
  progress: ChildPartial[];
}
