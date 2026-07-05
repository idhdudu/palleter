"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { orderFormSchema } from "@/lib/order-schema";
import { requireFarmerOrAdmin } from "@/lib/authorization";

async function ensureEditableOrder(orderId: string, userId: string, role: Role) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, ownerId: true },
  });

  if (!order) throw new Error("Pedido no encontrado");
  if (role !== Role.ADMIN && order.ownerId !== userId) {
    throw new Error("No tienes permiso para modificar este pedido");
  }
}

function makeReference() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

export type OrderActionState = {
  error?: string;
};

export async function createOrderAction(
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const session = await requireFarmerOrAdmin();
  const parsed = orderFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Revisa los datos del pedido." };

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true, ownerId: true },
  });

  if (!product) return { error: "El producto seleccionado no existe." };
  if (session.user.role !== Role.ADMIN && product.ownerId !== session.user.id) {
    return { error: "Solo puedes crear pedidos para tus propios productos." };
  }

  await prisma.order.create({
    data: {
      reference: makeReference(),
      ownerId: session.user.id,
      productId: product.id,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      quantity: parsed.data.quantity,
      deliveryType: parsed.data.deliveryType,
      status: parsed.data.status,
      pickupAt: parsed.data.pickupAt,
      deliveryTown: parsed.data.deliveryTown,
      deliveryAddress: parsed.data.deliveryAddress,
      customerNotes: parsed.data.customerNotes,
      internalNotes: parsed.data.internalNotes,
    },
  });

  revalidatePath("/panel/pedidos");
  redirect("/panel/pedidos?created=1");
}

export async function setOrderStatusAction(orderId: string, status: OrderStatus) {
  const session = await requireFarmerOrAdmin();
  await ensureEditableOrder(orderId, session.user.id, session.user.role);

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/panel/pedidos");
  redirect("/panel/pedidos?updated=1");
}

export async function deleteOrderAction(orderId: string) {
  const session = await requireFarmerOrAdmin();
  await ensureEditableOrder(orderId, session.user.id, session.user.role);

  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/panel/pedidos");
  redirect("/panel/pedidos?deleted=1");
}
