import { SetMetadata } from "@nestjs/common";

export type Role =
  | "SUPER_ADMIN"
  | "CONTENT_EDITOR"
  | "ADMISSIONS_MANAGER"
  | "VIEWER";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

