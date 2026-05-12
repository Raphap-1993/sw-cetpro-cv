import type { AdminRole } from "./types";

export type AdminSection =
  | "dashboard"
  | "leads"
  | "programs"
  | "content"
  | "media";

type SectionDefinition = {
  href: string;
  key: AdminSection;
  label: string;
  description: string;
  roles: AdminRole[];
};

export const adminSections: SectionDefinition[] = [
  {
    href: "/admin",
    key: "dashboard",
    label: "Resumen",
    description: "Punto de entrada del backoffice.",
    roles: ["SUPER_ADMIN", "CONTENT_EDITOR", "ADMISSIONS_MANAGER"]
  },
  {
    href: "/admin/leads",
    key: "leads",
    label: "Leads",
    description: "Bandeja de solicitudes y seguimiento basico.",
    roles: ["SUPER_ADMIN", "ADMISSIONS_MANAGER"]
  },
  {
    href: "/admin/programas",
    key: "programs",
    label: "Programas",
    description: "Catalogo academico y estados de publicacion.",
    roles: ["SUPER_ADMIN", "CONTENT_EDITOR"]
  },
  {
    href: "/admin/contenido",
    key: "content",
    label: "Contenido",
    description: "Bloques institucionales editables por pagina.",
    roles: ["SUPER_ADMIN", "CONTENT_EDITOR"]
  },
  {
    href: "/admin/media",
    key: "media",
    label: "Media",
    description: "Biblioteca reusable basada en URLs controladas.",
    roles: ["SUPER_ADMIN", "CONTENT_EDITOR"]
  }
];

export function canAccessSection(role: AdminRole, section: AdminSection) {
  const match = adminSections.find((item) => item.key === section);
  return Boolean(match?.roles.includes(role));
}

export function getSectionsForRole(role: AdminRole) {
  return adminSections.filter((section) => section.roles.includes(role));
}

export function getRoleLabel(role: AdminRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super admin";
    case "CONTENT_EDITOR":
      return "Editor de contenido";
    case "ADMISSIONS_MANAGER":
      return "Admision";
    default:
      return role;
  }
}
