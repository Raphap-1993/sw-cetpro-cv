# AGENTS.md - sw-cetpro-cv

Este repo hereda la ley global de agentes de `/Users/rapha/AGENTS.md`.

## Memoria operativa

- Obsidian project memory: `/Users/rapha/Documents/Obsidian Vault/20_Projects/sw-cetpro-cv`
- Context: `/Users/rapha/Documents/Obsidian Vault/20_Projects/sw-cetpro-cv/00 Context.md`
- Status: `/Users/rapha/Documents/Obsidian Vault/20_Projects/sw-cetpro-cv/01 Status.md`
- Requirements: `/Users/rapha/Documents/Obsidian Vault/20_Projects/sw-cetpro-cv/06 Requirements.md`
- Traceability: `/Users/rapha/Documents/Obsidian Vault/20_Projects/sw-cetpro-cv/09 Traceability.md`

## Estado actual

El proyecto esta en base documental cerrada para preparar implementacion.

Stack vigente:

- Next.js
- NestJS
- Prisma
- PostgreSQL
- IAM propio con JWT, roles y permisos

Alcance MVP vigente:

- web publica institucional;
- programas y planes de estudio;
- captacion de leads;
- backoffice administrativo modular basico.

Antes de crear o modificar estructura de aplicacion, revisar:

1. `00 Context.md`
2. `01 Status.md`
3. `11 Technical Discovery.md`
4. `12 Functional Discovery.md`
5. `13 Agent Prompts.md`
6. `06 Requirements.md`

## Reglas locales

- No inventar alcance funcional.
- No seleccionar stack definitivo sin una decision registrada.
- No usar Payload como decision activa; la base vigente es Next.js + NestJS + Prisma + PostgreSQL + IAM propio.
- Mantener Git como verdad tecnica y Obsidian como memoria curada.
- Registrar avances reales en `09 Traceability.md`.
- Si se abre trabajo con subagentes, usar el roster oficial global.
