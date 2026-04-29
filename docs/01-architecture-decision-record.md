# Arquitectura - Decision Inicial

## Stack propuesto (enterprise-ready pero pragmatico)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind + shadcn/ui
- GSAP (animaciones premium UX)

### Backend
- NestJS (modular, enterprise-ready)
- Arquitectura hexagonal ligera
- API REST (GraphQL opcional futuro)

### Base de datos
- PostgreSQL (compartido en VPS)
- ORM: Prisma

### Autenticacion
- JWT + refresh tokens
- RBAC (roles + permisos)

### Storage
- Inicial: local VPS (Hestia)
- Escalable: Cloudflare R2

### Infraestructura
- VPS (Hestia)
- PM2 para procesos Node
- Nginx reverse proxy

---

## Principios de arquitectura

- Separacion clara frontend/backend
- Dominio desacoplado (preparado para ERP)
- Modularidad desde el inicio
- Escalabilidad progresiva
- Seguridad por diseño

---

## Estructura inicial de servicios

- web (Next.js)
- api (NestJS)
- db (PostgreSQL existente)

---

## Decision clave

Se evita monolito tipo WordPress.
Se construye base SaaS-ready reutilizable para futuros clientes CETPRO/educacion.
