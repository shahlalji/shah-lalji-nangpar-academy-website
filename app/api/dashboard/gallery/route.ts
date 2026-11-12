import {
  createGalleryItem,
  getDashboardGalleryItems,
} from "@/db/dashboard";
import { requireDashboardApiUser } from "@/lib/dashboard-auth";
import { gallerySlug, parseGalleryPayload } from "@/lib/dashboard-gallery";
import { resolveDashboardImage } from "@/lib/dashboard-storage";

export async function GET() {
  const access = await requireDashboardApiUser();
  if (access.error) return access.error;
  try {
    return Response.json({ items: await getDashboardGalleryItems() });
  } catch {
    return Response.json(
      { error: "The Gallery panel is not ready. Run supabase/gallery-library.sql." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const access = await requireDashboardApiUser();
  if (access.error || !access.user) return access.error;

  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const parsed = parseGalleryPayload(payload);
    const objectPath = String(payload.imageObjectPath ?? "");
    if (!parsed || !objectPath) {
      return Response.json(
        { error: "Choose a photograph and complete its title, section and image description." },
        { status: 400 },
      );
    }
    const imageUrl = await resolveDashboardImage(objectPath, "gallery");
    if (!imageUrl) {
      return Response.json(
        { error: "The uploaded gallery image could not be verified." },
        { status: 400 },
      );
    }

    const slugBase = gallerySlug(parsed.title) || "gallery-photo";
    const item = await createGalleryItem({
      ...parsed,
      slug: `${slugBase}-${Date.now().toString(36)}`,
      imageUrl,
      createdBy: access.user.id,
    });
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    return Response.json(
      {
        error: message.includes("gallery_items")
          ? "The Gallery panel is not ready. Run supabase/gallery-library.sql."
          : "The gallery photograph could not be saved.",
      },
      { status: 500 },
    );
  }
}
