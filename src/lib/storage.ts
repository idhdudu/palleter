import crypto from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const uploadRoot = path.join(process.cwd(), "public", "uploads");

function sanitizeFileName(fileName: string) {
  const base = path.basename(fileName).replace(/[^a-zA-Z0-9._-]+/g, "-");
  return base || "image";
}

function extensionFromFile(file: File) {
  const mime = file.type.toLowerCase();
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "image/avif") return ".avif";
  return "";
}

export async function uploadImageFile(
  file: File,
  folder = "products",
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFileName(file.name);
  const finalName = `${Date.now()}-${crypto.randomUUID()}-${safeName}${extensionFromFile(file)}`;
  const targetDir = path.join(uploadRoot, folder);

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, finalName), buffer);

  return `/uploads/${folder}/${finalName}`;
}

export async function uploadImageFilesFromFormData(
  formData: FormData,
  fieldName: string,
  folder = "products",
): Promise<string[]> {
  const values = formData.getAll(fieldName);
  const files = values.filter((value): value is File => value instanceof File && value.size > 0);

  if (!files.length) return [];

  return Promise.all(files.map((file) => uploadImageFile(file, folder)));
}

