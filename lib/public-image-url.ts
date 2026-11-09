export function normalizePublicImageUrl(url: string) {
  return url.replace(
    "/storage/v1/render/image/public/",
    "/storage/v1/object/public/",
  );
}
