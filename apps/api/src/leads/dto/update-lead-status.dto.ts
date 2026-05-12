import { IsIn } from "class-validator";

export class UpdateLeadStatusDto {
  @IsIn(["NEW", "CONTACTED", "CLOSED", "DISCARDED"])
  status!: "NEW" | "CONTACTED" | "CLOSED" | "DISCARDED";
}

