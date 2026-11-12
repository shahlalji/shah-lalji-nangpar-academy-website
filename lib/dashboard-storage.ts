import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function resolveDashboardImage(
  objectPath: string,
  folder: "events" | "pages" | "gallery",
) {
  const pattern = new RegExp(
    `^${folder}/[a-z0-9][a-z0-9_-]*[.](?:jpe?g|png|webp|avif)$`,
    "i",
  );
  if (!pattern.test(objectPath)) return null;

  const separator = objectPath.lastIndexOf("/");
  const directory = objectPath.slice(0, separator);
  const fileName = objectPath.slice(separator + 1);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from("site-images")
    .list(directory, { limit: 10, search: fileName });
  if (error || !data?.some((file) => file.name === fileName)) return null;

  return supabase.storage.from("site-images").getPublicUrl(objectPath).data.publicUrl;
}

export async function resolveDashboardDocument(objectPath: string) {
  if (!/^documents\/[a-z0-9][a-z0-9_-]*[.]pdf$/i.test(objectPath)) return null;

  const separator = objectPath.lastIndexOf("/");
  const directory = objectPath.slice(0, separator);
  const fileName = objectPath.slice(separator + 1);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from("site-documents")
    .list(directory, { limit: 10, search: fileName });
  if (error || !data?.some((file) => file.name === fileName)) return null;

  return supabase.storage.from("site-documents").getPublicUrl(objectPath).data.publicUrl;
}

export async function removeDashboardImageByUrl(publicUrl: string) {
  if (!publicUrl.startsWith("https://")) return;
  try {
    const marker = "/storage/v1/object/public/site-images/";
    const path = new URL(publicUrl).pathname.split(marker)[1];
    if (!path) return;
    const supabase = await createSupabaseServerClient();
    await supabase.storage.from("site-images").remove([decodeURIComponent(path)]);
  } catch {
    // Database changes remain valid even if an old storage object cannot be removed.
  }
}
