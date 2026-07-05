import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireFarmerOrAdmin } from "@/lib/authorization";
import { EditProductForm } from "./edit-product-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireFarmerOrAdmin();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { availability: { orderBy: { startsAt: "asc" } } },
  });

  if (!product) notFound();
  if (session.user.role !== "ADMIN" && product.ownerId !== session.user.id) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10 lg:px-12">
      <EditProductForm product={product} />
    </main>
  );
}
