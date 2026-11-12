import { isGallerySectionKey } from "@/data/gallery";

export function parseGalleryPayload(payload: Record<string, unknown>) {
  const section = String(payload.section ?? "");
  const title = String(payload.title ?? "").trim().slice(0, 120);
  const caption = String(payload.caption ?? "").trim().slice(0, 180);
  const imageAlt = String(payload.imageAlt ?? "").trim().slice(0, 220);
  const sortOrder = Number(payload.sortOrder ?? 100);
  if (
    !isGallerySectionKey(section) ||
    !title ||
    !imageAlt ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) return null;
  return {
    section,
    title,
    caption,
    imageAlt,
    published: payload.published !== false,
    sortOrder,
  };
}

export function gallerySlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
