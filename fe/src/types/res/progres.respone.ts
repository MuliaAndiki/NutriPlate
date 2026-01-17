import { IProgram } from "../schema/program.schema";
import { IProgress } from "../schema/progres.schema";
import { ChildPartial } from "./child.respone";

export interface ProgresRespone extends IProgress {
  child: ChildPartial;
  program: IProgram;
  //subtask
  //progressSummary
}
