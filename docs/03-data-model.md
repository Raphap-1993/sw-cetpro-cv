# Modelo de Datos (Base ERP Ready)

## Entidades principales (MVP + futuro)

### Core
- User
- Role
- Permission

### Marketing / MVP
- Lead (nombre, email, telefono, programa_interes)
- Program
- Category
- ContentBlock

### Futuro ERP
- Student
- Enrollment
- Payment
- Attendance
- Certificate

---

## Enfoque de diseño

- Normalizacion adecuada
- Preparado para multi-tenant (futuro)
- Auditoria (tabla logs futura)

---

## ORM

Se utilizara Prisma por:

- Tipado fuerte
- Rapidez de desarrollo
- Buen soporte PostgreSQL
- Migraciones controladas

---

## Nota importante

Aunque el MVP es solo web, la BD se diseña como si fuera un ERP completo desde el inicio.
