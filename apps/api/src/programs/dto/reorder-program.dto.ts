import { IsIn } from "class-validator";

export class ReorderProgramDto {
  @IsIn(["up", "down"])
  direction!: "up" | "down";
}
