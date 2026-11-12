import {
  deleteGalleryItem,
  getDashboardGalleryItems,
  updateGalleryItem,
} from "@/db/dashboard";
import { requireDashboardApiUser } from "@/lib/dashboard-auth";
import { parseGalleryPayload } from "@/lib/dashboard-gallery";
import {
  removeDashboardImageByUrl,
  resolveDashboardImage,
} from "@/lib/dashboard-storage";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardApiUser();
  if (access.error) return access.error;
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Unknown gallery photograph." }, { status: 400 });
  }

  try {
    const existing = (await getDashboardGalleryItems()).find((item) => item.id === id);
    if (!existing) {
      return Response.json({ error: "Gallery photograph not found." }, { status: 404 });
    }
    const payload = (await request.json()) as Record<string, unknown>;
    const parsed = parseGalleryPayload(payload);
    if (!parsed) {
      return Response.json(
        { error: "Complete the title, section and image description correctly." },
        { status: 400 },
      );
    }

    const objectPath = String(payload.imageObjectPath ?? "");
    const replacementUrl = objectPath
      ? await resolveDashboardImage(objectPath, "gallery")
      : null;
    if (objectPath && !replacementUrl) {
      return Response.json(
        { error: "The uploaded gallery image could not be verified." },
        { status: 400 },
      );
    }

    const item = await updateGalleryItem(id, {
      ...parsed,
      imageUrl: replacementUrl || existing.src,
    });
    if (replacementUrl && replacementUrl !== existing.src) {
      await removeDashboardImageByUrl(existing.src);
    }
    return Response.json({ item });
  } catch {
    return Response.json(
      { error: "The gallery photograph could not be updated." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardApiUser();
  if (access.error) return access.error;
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Unknown gallery photograph." }, { status: 400 });
  }

  try {
    const existing = (await getDashboardGalleryItems()).find((item) => item.id === id);
    if (!existing) {
      return Response.json({ error: "Gallery photograph not found." }, { status: 404 });
    }
    await deleteGalleryItem(id);
    await removeDashboardImageByUrl(existing.src);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "The gallery photograph could not be deleted." },
      { status: 500 },
    );
  }
}
