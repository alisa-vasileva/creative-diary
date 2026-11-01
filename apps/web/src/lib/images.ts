import type { TaskImage } from "@creative-diary/core";

const MAX_INPUT_BYTES = 25_000_000;
const MAX_EDGE = 1280;
const QUALITY = 0.8;

/**
 * Decode, downscale and re-encode a photo as a JPEG data URL. Phone photos shrink
 * from several MB to roughly 150–300 KB, which keeps localStorage's ~5 MB budget usable.
 */
export async function readImageFile(file: File): Promise<TaskImage> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image.`);
  if (file.size > MAX_INPUT_BYTES) throw new Error(`${file.name} is too large (over 25 MB).`);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser can't process images.");
  // JPEG has no alpha; paint transparent areas as paper instead of black.
  context.fillStyle = "#f8f4dd";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return { id: crypto.randomUUID(), name: file.name, src: canvas.toDataURL("image/jpeg", QUALITY) };
}
