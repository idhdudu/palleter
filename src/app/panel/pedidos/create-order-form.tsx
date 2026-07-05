"use client";

import { useActionState } from "react";
import { OrderDeliveryType, OrderStatus, type Product } from "@prisma/client";
import { createOrderAction, type OrderActionState } from "./actions";

const initialState: OrderActionState = {};
type ProductOption = Pick<Product, "id" | "title" | "category" | "zone">;

export function CreateOrderForm({ products }: { products: ProductOption[] }) {
  const [state, formAction, pending] = useActionState(createOrderAction, initialState);
  const fieldClassName =
    "mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3 outline-none transition focus:border-[var(--accent)]";

  return (
    <form action={formAction} className="rounded-[1.5rem] border border-black/8 bg-white/65 p-5">
      <h2 className="text-xl font-semibold">Nuevo pedido</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Registra pedidos manuales para controlar recogidas, reparto y clientes.
      </p>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Producto</span>
        <select name="productId" className={fieldClassName} required defaultValue="">
          <option value="" disabled>
            Selecciona un producto
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Cliente</span>
          <input name="customerName" className={fieldClassName} required />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Telefono</span>
          <input name="customerPhone" className={fieldClassName} />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Email cliente</span>
        <input type="email" name="customerEmail" className={fieldClassName} />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Cantidad</span>
          <input type="number" name="quantity" min="1" defaultValue={1} className={fieldClassName} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Tipo</span>
          <select name="deliveryType" defaultValue={OrderDeliveryType.PICKUP} className={fieldClassName}>
            <option value={OrderDeliveryType.PICKUP}>Recogida local</option>
            <option value={OrderDeliveryType.DELIVERY}>Envio</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Estado</span>
          <select name="status" defaultValue={OrderStatus.PENDING} className={fieldClassName}>
            <option value={OrderStatus.PENDING}>Pendiente</option>
            <option value={OrderStatus.READY}>Listo</option>
            <option value={OrderStatus.PICKED_UP}>Recogido</option>
            <option value={OrderStatus.SHIPPED}>Enviado</option>
            <option value={OrderStatus.COMPLETED}>Completado</option>
            <option value={OrderStatus.CANCELLED}>Cancelado</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Fecha recogida / envio</span>
          <input type="date" name="pickupAt" className={fieldClassName} />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Poblacion</span>
          <input name="deliveryTown" className={fieldClassName} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Direccion entrega</span>
          <input name="deliveryAddress" className={fieldClassName} />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Notas cliente</span>
        <textarea name="customerNotes" rows={3} className={fieldClassName} />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium">Notas internas</span>
        <textarea name="internalNotes" rows={3} className={fieldClassName} />
      </label>

      {state.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-strong)] px-5 py-3 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Crear pedido"}
      </button>
    </form>
  );
}
