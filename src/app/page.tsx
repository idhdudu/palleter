/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { DeliveryMode } from "@prisma/client";
import type { Prisma, ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  categoryLabels,
  extractImageUrls,
  deliveryModeLabels,
  formatDecimal,
  formatMoney,
  getPrimaryImageUrl,
  summarizePricingTiers,
  summarizeSaleOptions,
} from "@/lib/public-catalog";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  zone?: string;
  pickup?: string;
  delivery?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

const categoryCards = [
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

const quickFilters = [
  { label: "Hoy disponible", href: "?delivery=1" },
  { label: "Recogida local", href: "?pickup=1" },
  { label: "Precio bajo", href: "?maxPrice=10" },
  { label: "Ver todo", href: "/" },
];

function parsePriceValue(value?: string) {
  if (!value) return null;
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed * 100);
}

function buildWhere(searchParams: {
  q?: string;
  category?: string;
  zone?: string;
  pickup?: string;
  delivery?: string;
  minPrice?: string;
  maxPrice?: string;
}): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    public: true,
  };

  const q = searchParams.q?.trim();
  const category = searchParams.category?.trim();
  const zone = searchParams.zone?.trim();
  const wantsPickup = searchParams.pickup === "1";
  const wantsDelivery = searchParams.delivery === "1";
  const minPrice = parsePriceValue(searchParams.minPrice);
  const maxPrice = parsePriceValue(searchParams.maxPrice);

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { zone: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category && Object.keys(categoryLabels).includes(category)) {
    where.category = category as ProductCategory;
  }

  if (zone) {
    where.zone = { contains: zone, mode: "insensitive" };
  }

  if (wantsPickup) {
    where.localPickup = true;
  }

  if (wantsDelivery) {
    where.deliveryMode = { not: DeliveryMode.NONE };
  }

  if (minPrice !== null || maxPrice !== null) {
    where.priceCents = {
      ...(minPrice !== null ? { gte: minPrice } : {}),
      ...(maxPrice !== null ? { lte: maxPrice } : {}),
    };
  }

  return where;
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const where = buildWhere(params);
  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        owner: { select: { name: true } },
        availability: { orderBy: { startsAt: "asc" } },
      },
      orderBy: [{ createdAt: "desc" }],
    }),
    prisma.product.count({ where: { public: true } }),
  ]);

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="overflow-hidden rounded-[2rem] border border-[var(--panel-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(245,236,220,0.58))] shadow-[0_28px_90px_rgba(44,60,38,0.12)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                Palleter
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Mercado agrícola local para encontrar producto fresco, de
                proximidad y con reparto claro.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Fichas SEO, filtros por peso, precio y zona, reparto por
                proximidad y una base pensada para que agricultores publiquen
                producto sin fricción.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#catalogo"
                  className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Ver catálogo
                </a>
                <a
                  href="/auth/register"
                  className="rounded-full border border-[var(--panel-border)] bg-white/70 px-5 py-3 text-sm font-medium text-[var(--accent-strong)]"
                >
                  Crear cuenta agricultor
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {quickFilters.map((filter) => (
                  <a
                    key={filter.label}
                    href={filter.href}
                    className="rounded-full border border-[var(--panel-border)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
                  >
                    {filter.label}
                  </a>
                ))}
              </div>
            </div>

            <aside className="border-t border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(53,84,43,0.08),rgba(255,255,255,0.52))] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="rounded-[1.5rem] border border-white/50 bg-white/70 p-5 shadow-[0_12px_35px_rgba(44,60,38,0.10)]">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                  Buscar
                </p>
                <form className="mt-4 grid gap-3" method="get">
                  <input
                    name="q"
                    defaultValue={params.q}
                    placeholder="Producto, agricultor o población"
                    className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      name="zone"
                      defaultValue={params.zone}
                      placeholder="Zona"
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    />
                    <select
                      name="category"
                      defaultValue={params.category ?? ""}
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    >
                      <option value="">Todas las categorías</option>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      name="minPrice"
                      defaultValue={params.minPrice}
                      placeholder="Precio mínimo (€)"
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    />
                    <input
                      name="maxPrice"
                      defaultValue={params.maxPrice}
                      placeholder="Precio máximo (€)"
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <label className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2">
                      <input type="checkbox" name="pickup" value="1" defaultChecked={params.pickup === "1"} />
                      Recogida
                    </label>
                    <label className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2">
                      <input
                        type="checkbox"
                        name="delivery"
                        value="1"
                        defaultChecked={params.delivery === "1"}
                      />
                      Envío
                    </label>
                  </div>
                  <button className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white">
                    Aplicar filtros
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {categoryCards.map((category) => (
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

        <section id="catalogo" className="mt-8 rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Catálogo público
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {products.length} resultados de {totalProducts} productos
                publicados
              </h2>
            </div>
            <a
              href="/panel"
              className="rounded-full border border-[var(--panel-border)] bg-white/65 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
            >
              Publicar producto
            </a>
          </div>

          <div className="mt-6 grid gap-4">
            {products.length ? (
              products.map((product) => {
                const saleOptions = summarizeSaleOptions(product.saleOptions);
                const pricingTiers = summarizePricingTiers(product.pricingTiers);
                const imageUrls = extractImageUrls(product.images);
                const primaryImage = getPrimaryImageUrl(product.images);

                return (
                  <article
                    key={product.id}
                    className="rounded-[1.5rem] border border-black/5 bg-white/75 p-5"
                  >
                    {primaryImage ? (
                      <div className="mb-4 overflow-hidden rounded-[1.25rem] border border-black/5 bg-[rgba(95,124,73,0.08)]">
                        <img
                          src={primaryImage}
                          alt={product.title}
                          className="h-56 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[rgba(95,124,73,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-strong)]">
                            {categoryLabels[product.category]}
                          </span>
                          <span className="text-xs text-[var(--muted)]">
                            {product.zone}
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold">
                          <Link href={`/producto/${product.slug}`}>{product.title}</Link>
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                          {product.description ||
                            "Producto local publicado con información de peso, precio y reparto."}
                        </p>
                      </div>

                      <div className="rounded-full bg-[rgba(53,84,43,0.10)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                        {formatMoney(product.priceCents)}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Peso
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDecimal(product.minWeightKg)} -{" "}
                          {formatDecimal(product.maxWeightKg)} kg
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Envio
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {formatMoney(product.shippingCents)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Reparto
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {deliveryModeLabels[product.deliveryMode]}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          Recogida
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {product.localPickup ? "Disponible" : "No disponible"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-sm font-semibold">Formatos de venta</p>
                        {saleOptions.length ? (
                          <ul className="mt-2 grid gap-2 text-sm text-[var(--muted)]">
                            {saleOptions.slice(0, 3).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-[var(--muted)]">
                            Sin formatos definidos
                          </p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-sm font-semibold">Tramos de precio</p>
                        {pricingTiers.length ? (
                          <ul className="mt-2 grid gap-2 text-sm text-[var(--muted)]">
                            {pricingTiers.slice(0, 3).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-[var(--muted)]">
                            Sin tramos definidos
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-[var(--muted)]">
                        {product.owner.name
                          ? `Publicado por ${product.owner.name}`
                          : "Publicado por agricultor"}
                        {product.availability.length
                          ? ` · ${product.availability.length} ventanas de disponibilidad`
                          : ""}
                      </p>
                      <Link
                        href={`/producto/${product.slug}`}
                        className="rounded-full border border-[var(--panel-border)] bg-[rgba(95,124,73,0.06)] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
                      >
                        Ver ficha
                      </Link>
                    </div>

                    {imageUrls.length > 1 ? (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {imageUrls.slice(1, 4).map((imageUrl) => (
                          <img
                            key={imageUrl}
                            src={imageUrl}
                            alt={product.title}
                            className="h-16 w-16 flex-none rounded-2xl border border-black/5 object-cover"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-white/55 p-6 text-sm text-[var(--muted)]">
                No hay productos que coincidan con estos filtros.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
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
