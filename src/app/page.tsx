const publicCategories = [
  "Hortalizas",
  "Frutas",
  "Verduras",
  "Aceites",
  "Miel",
  "Producto de temporada",
];

const platformPillars = [
  {
    title: "Portal publico",
    description:
      "Ficha de producto, SEO fuerte, categorias claras y filtros por fecha, peso, precio, zona y envio.",
  },
  {
    title: "Panel agricultor",
    description:
      "Registro, login, alta de productos, disponibilidad, precios, pesos, contacto y gestion de envios.",
  },
  {
    title: "Backend seguro",
    description:
      "Validacion en servidor, roles, control de acceso, logs, auditoria y proteccion de datos personales.",
  },
];

const roadmap = [
  "Next.js + TypeScript como base de frontend y backend",
  "PostgreSQL + Prisma para el modelo de datos",
  "Auth.js o Supabase Auth para identidad y roles",
  "S3 compatible o Supabase Storage para fotos y archivos",
];

export default function Home() {
  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(44,60,38,0.10)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
                Palleter
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Mercado agricola digital para publicar, descubrir y vender
                producto local.
              </h1>
            </div>
            <div className="rounded-full border border-[var(--panel-border)] bg-white/55 px-4 py-2 text-sm font-medium text-[var(--accent-strong)] shadow-sm">
              Base tecnica lista para escalar
            </div>
          </div>

          <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Este proyecto arranca con Next.js, TypeScript, PostgreSQL y Prisma.
            La primera fase cubre portal publico, panel de agricultor, control
            de acceso y una base pensada para SEO, seguridad y crecimiento.
          </p>

          <div className="flex flex-wrap gap-3">
            {publicCategories.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--panel-border)] bg-white/65 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/auth/signin"
              className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
            >
              Acceso agricultor
            </a>
            <a
              href="/auth/register"
              className="rounded-full border border-[var(--panel-border)] bg-white/55 px-5 py-3 text-sm font-medium text-[var(--accent-strong)]"
            >
              Crear cuenta
            </a>
            <span className="rounded-full border border-[var(--panel-border)] bg-white/55 px-5 py-3 text-sm font-medium text-[var(--muted)]">
              Panel privado listo para autenticacion
            </span>
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {platformPillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg"
            >
              <h2 className="text-xl font-semibold">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {pillar.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Roadmap inicial
            </p>
            <ul className="mt-5 grid gap-3">
              {roadmap.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-black/5 bg-white/55 px-4 py-3 text-sm leading-6 text-[var(--foreground)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[linear-gradient(160deg,rgba(95,124,73,0.18),rgba(255,255,255,0.48))] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Criterios de producto
            </p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-sm text-[var(--muted)]">Busqueda publica</p>
                <p className="mt-1 font-medium">
                  Empezar con full-text search en Postgres.
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-sm text-[var(--muted)]">Almacenamiento</p>
                <p className="mt-1 font-medium">
                  Fotos y archivos en S3 compatible o Supabase Storage.
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-sm text-[var(--muted)]">Seguridad</p>
                <p className="mt-1 font-medium">
                  Hash fuerte, validacion en servidor y permisos por rol.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            Acceso privado
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/panel"
              className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
            >
              Ir al panel
            </a>
            <a
              href="/auth/signin"
              className="rounded-full border border-[var(--panel-border)] bg-white/55 px-5 py-3 text-sm font-medium text-[var(--accent-strong)]"
            >
              Iniciar sesion
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
