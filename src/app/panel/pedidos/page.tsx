import Link from "next/link";
import { OrderStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireFarmerOrAdmin } from "@/lib/authorization";
import { CreateOrderForm } from "./create-order-form";
import { deleteOrderAction, setOrderStatusAction } from "./actions";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  READY: "Listo",
  PICKED_UP: "Recogido",
  SHIPPED: "Enviado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export default async function OrdersPage() {
  const session = await requireFarmerOrAdmin();
  const isAdmin = session.user.role === Role.ADMIN;

  const [products, orders] = await Promise.all([
    prisma.product.findMany({
      where: isAdmin ? {} : { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, category: true, zone: true },
    }),
    prisma.order.findMany({
      where: isAdmin ? {} : { ownerId: session.user.id },
      include: {
        product: { select: { id: true, title: true, zone: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_18px_50px_rgba(44,60,38,0.08)] backdrop-blur-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
              Mini admin
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Pedidos y clientes
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Control basico para recogidas, envios y seguimiento de clientes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/panel"
              className="rounded-full border border-[var(--panel-border)] bg-white/55 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
            >
              Productos
            </Link>
            <div className="rounded-full border border-[var(--panel-border)] bg-white/60 px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
              {orders.length} pedidos
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <CreateOrderForm products={products} />

          <div className="grid gap-4">
            {orders.length ? (
              orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[1.5rem] border border-black/8 bg-white/65 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        {order.reference}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold">
                        {order.customerName}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {order.product.title} · {order.product.zone}
                      </p>
                    </div>

                    <form action={deleteOrderAction.bind(null, order.id)}>
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                      >
                        Borrar
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[var(--muted)]">Cliente</p>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-[var(--muted)]">
                        {order.customerEmail ?? "Sin email"} ·{" "}
                        {order.customerPhone ?? "Sin telefono"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--muted)]">Tipo</p>
                      <p className="font-medium">
                        {order.deliveryType === "PICKUP"
                          ? "Recogida local"
                          : "Envio"}
                      </p>
                      <p className="text-[var(--muted)]">
                        Estado:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {statusLabels[order.status]}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <p>
                      Fecha:{" "}
                      <span className="font-medium text-[var(--foreground)]">
                        {order.pickupAt
                          ? order.pickupAt.toLocaleDateString("es-ES")
                          : "Pendiente"}
                      </span>
                    </p>
                    <p>
                      Poblacion:{" "}
                      <span className="font-medium text-[var(--foreground)]">
                        {order.deliveryTown ?? "No definida"}
                      </span>
                    </p>
                  </div>

                  {order.customerNotes ? (
                    <p className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-[var(--foreground)]">
                      {order.customerNotes}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      OrderStatus.PENDING,
                      OrderStatus.READY,
                      OrderStatus.PICKED_UP,
                      OrderStatus.SHIPPED,
                      OrderStatus.COMPLETED,
                      OrderStatus.CANCELLED,
                    ].map((status) => (
                      <form
                        key={status}
                        action={setOrderStatusAction.bind(null, order.id, status)}
                      >
                        <button
                          type="submit"
                          className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium"
                        >
                          {statusLabels[status]}
                        </button>
                      </form>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-white/55 p-6 text-sm text-[var(--muted)]">
                Aun no hay pedidos registrados.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
