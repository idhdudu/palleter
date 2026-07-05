# Palleter

Palleter es la base de una plataforma agricola con Next.js, TypeScript, PostgreSQL y Prisma.

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Auth.js o Supabase Auth
- S3 compatible o Supabase Storage

## Alcance inicial

- Portal publico con categorias y fichas de producto
- Panel agricultor para crear y gestionar productos
- Validacion estricta en servidor
- Roles: agricultor, admin y consumidor
- Logs y auditoria
- Busqueda publica con Postgres full-text search

## Arranque local

1. Copia `.env.example` a `.env.local`
2. Ajusta `DATABASE_URL`
3. Ejecuta `npm run dev`

## Estado actual

El proyecto ya esta creado en esta carpeta con una base visual, un modelo de datos inicial y la estructura preparada para seguir construyendo.
