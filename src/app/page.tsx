const publicCategories = [
  {
    name: "Hortalizas",
    description: "Tomate, pimiento, cebolla, calabacín y producto de huerta.",
  },
  {
    name: "Frutas",
    description: "Cítricos, fruta de temporada y cosecha de proximidad.",
  },
  {
    name: "Verduras",
    description: "Producto fresco, recogido cerca y con disponibilidad clara.",
  },
  {
    name: "Aceites",
    description: "Aceite de oliva virgen extra y lotes por litro o garrafa.",
  },
  {
    name: "Miel",
    description: "Miel local, formatos pequeños y venta por peso o unidad.",
  },
  {
    name: "Temporada",
    description: "Productos estacionales con disponibilidad limitada.",
  },
];

const featuredProducts = [
  {
    title: "Aceite de oliva virgen extra",
    farmer: "Finca La Sierra",
    zone: "Jaén y alrededores",
    price: "Desde 8,50 € / L",
    priceNote: "Garrafas de 1, 2 y 5 litros",
    badges: ["Recogida local", "Envío por zona", "Producto premium"],
  },
  {
    title: "Miel de flor de azahar",
    farmer: "Colmenas del Valle",
    zone: "Valencia y comarcas cercanas",
    price: "Desde 6,00 € / tarro",
    priceNote: "Tarros de 250 g, 500 g y 1 kg",
    badges: ["Venta por unidad", "Recogida", "Entrega por pueblos"],
  },
  {
    title: "Tomate de temporada",
    farmer: "Huerta Solar",
    zone: "Murcia norte",
    price: "2,00 € / kg",
    priceNote: "Tramos de precio por volumen",
    badges: ["Por kilos", "Precio escalado", "Fresco semanal"],
  },
];

const pricingExamples = [
  {
    title: "Formato fijo",
    description: "Ideal para 1 kg, 2 kg, 3 kg, 1 L o 2 L.",
    example: "1|KG|350",
  },
  {
    title: "Precio por tramo",
    description: "Perfecto para bajar el precio cuando el pedido crece.",
    example: "1|5|KG|200",
  },
  {
    title: "Entrega flexible",
    description: "Recogida local, reparto por km o por poblaciones.",
    example: "Zona + fechas de reparto",
  },
];

const quickFilters = [
  "Hoy disponible",
  "Peso mínimo",
  "Peso máximo",
  "Precio bajo",
  "Recogida local",
  "Envío cercano",
];

const benefits = [
  "SEO fuerte para Google y fichas claras por producto.",
  "Filtros por fecha, peso, precio, zona y tipo de reparto.",
  "Panel agricultor simple con gestión de pedidos y contacto.",
  "Base preparada para crecer hacia búsqueda avanzada.",
];

export default function Home() {
  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="overflow-hidden rounded-[2rem] border border-[var(--panel-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(245,236,220,0.58))] shadow-[0_28px_90px_rgba(44,60,38,0.12)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                Palleter
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Mercado agrícola local para encontrar producto fresco, de
                proximidad y con reparto claro.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Fichas SEO, categorías claras, filtros por peso, precio y zona,
                y una base pensada para que agricultores publiquen producto sin
                fricción.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/auth/register"
                  className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Crear cuenta agricultor
                </a>
                <a
                  href="/panel"
                  className="rounded-full border border-[var(--panel-border)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--accent-strong)]"
                >
                  Entrar al panel
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {quickFilters.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--panel-border)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <aside className="border-t border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(53,84,43,0.08),rgba(255,255,255,0.52))] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="rounded-[1.5rem] border border-white/50 bg-white/70 p-5 shadow-[0_12px_35px_rgba(44,60,38,0.10)]">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                  Busca pública
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[var(--muted)]">
                    Producto, agricultor o población
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[var(--muted)]">
                    Peso, precio y disponibilidad
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[var(--muted)]">
                    Recogida local o envío por zona
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/55 bg-white/65 p-5">
                  <p className="text-sm text-[var(--muted)]">
                    Reparto por proximidad
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    Km, poblaciones y fechas concretas
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/55 bg-white/65 p-5">
                  <p className="text-sm text-[var(--muted)]">
                    Medidas flexibles
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    Kilos, litros, unidades y tramos
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {publicCategories.map((category) => (
            <article
              key={category.name}
              className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(44,60,38,0.12)]"
            >
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {category.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                  Productos destacados
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Una vitrina pensada para vender bien
                </h2>
              </div>
              <span className="rounded-full border border-[var(--panel-border)] bg-white/65 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
                SEO + conversión
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {featuredProducts.map((product) => (
                <article
                  key={product.title}
                  className="rounded-[1.5rem] border border-black/5 bg-white/70 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {product.farmer} · {product.zone}
                      </p>
                    </div>
                    <div className="rounded-full bg-[rgba(95,124,73,0.12)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                      {product.price}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[var(--foreground)]">
                    {product.priceNote}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-[var(--panel-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--accent-strong)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <aside className="grid gap-5">
            <article className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[linear-gradient(160deg,rgba(95,124,73,0.18),rgba(255,255,255,0.46))] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Medidas y precios
              </p>
              <div className="mt-5 grid gap-4">
                {pricingExamples.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/75 p-4">
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {item.description}
                    </p>
                    <div className="mt-3 rounded-xl bg-[rgba(54,84,43,0.08)] px-3 py-2 font-mono text-sm text-[var(--accent-strong)]">
                      {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Qué resuelve
              </p>
              <ul className="mt-5 grid gap-3">
                {benefits.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-black/5 bg-white/65 px-4 py-3 text-sm leading-6"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </aside>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Reparto y recogida
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              El agricultor decide cómo entrega cada producto
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Se puede marcar reparto por proximidad, elegir kilómetros,
              poblaciones concretas y fechas de reparto. También queda la
              recogida local disponible cuando el producto lo permita.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
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
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Agricultura, administración y consumidor quedan separados por
              roles desde la base.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
