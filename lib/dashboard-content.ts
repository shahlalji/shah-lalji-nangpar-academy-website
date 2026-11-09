import type {
  EventMutationInput,
  StoryMutationInput,
} from "@/db/dashboard";
import type { StorySection } from "@/data/stories";

export function parseStoryInput(payload: Record<string, unknown>): StoryMutationInput | null {
  const title = clean(payload.title, 140);
  const publishedAt = payload.publishedAt ? parseDate(payload.publishedAt) : null;
  const author = clean(payload.author, 120);
  const status = payload.status === "published" ? "published" : "draft";
  const sections = Array.isArray(payload.sections)
    ? payload.sections
        .slice(0, 12)
        .map((section) => parseStorySection(section))
        .filter((section): section is StorySection => Boolean(section))
    : [];
  const storyText = sections
    .flatMap((section) => section.paragraphs)
    .join(" ")
    .trim();
  const slug = clean(payload.slug, 140).toLowerCase() || slugify(title);
  const category = clean(payload.category, 80) || "School News";
  const excerpt = clean(payload.excerpt, 500) || buildExcerpt(storyText);
  const image = clean(payload.image, 500) || "/images/school/campus-assembly.webp";
  const alt = clean(payload.alt, 220) || `${title} at Shah Lalji Nangpar Academy`;
  const readTime = clean(payload.readTime, 40) || estimateReadTime(storyText);
  const quote = clean(payload.quote, 500) || excerpt;

  if (
    !title ||
    !validSlug(slug) ||
    !author ||
    !validImageUrl(image) ||
    sections.length < 1
  ) {
    return null;
  }

  return {
    title,
    publishedAt: publishedAt ?? undefined,
    slug,
    category,
    author,
    excerpt,
    image,
    alt,
    readTime,
    quote,
    status,
    sections,
  };
}

export function parseEventInput(payload: Record<string, unknown>): EventMutationInput | null {
  const title = clean(payload.title, 140);
  const slug = clean(payload.slug, 140).toLowerCase();
  const summary = clean(payload.summary, 500);
  const description = clean(payload.description, 4000);
  const location = clean(payload.location, 180);
  const image = clean(payload.image, 500);
  const alt = clean(payload.alt, 220);
  const startsAt = parseDate(payload.startsAt);
  const endsAt = payload.endsAt ? parseDate(payload.endsAt) : null;
  const status = payload.status === "published" ? "published" : "draft";

  if (
    !title ||
    !validSlug(slug) ||
    !summary ||
    !description ||
    !location ||
    !validImageUrl(image) ||
    !alt ||
    !startsAt ||
    (payload.endsAt && !endsAt) ||
    (endsAt && new Date(endsAt) < new Date(startsAt))
  ) {
    return null;
  }

  return {
    title,
    slug,
    summary,
    description,
    location,
    image,
    alt,
    startsAt,
    endsAt,
    status,
  };
}

function parseStorySection(value: unknown): StorySection | null {
  if (!value || typeof value !== "object") return null;
  const section = value as Record<string, unknown>;
  const heading = clean(section.heading, 140) || "The story";
  const image = clean(section.image, 500);
  const imageAlt = clean(section.imageAlt, 220) || "Story photograph";
  const paragraphs = Array.isArray(section.paragraphs)
    ? section.paragraphs.map((paragraph) => clean(paragraph, 2400)).filter(Boolean).slice(0, 12)
    : [];

  if (
    !heading ||
    paragraphs.length < 1 ||
    (image && (!validImageUrl(image) || !imageAlt))
  ) return null;
  return {
    heading,
    paragraphs,
    ...(image ? { image, imageAlt } : {}),
  };
}

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildExcerpt(value: string) {
  if (value.length <= 500) return value;
  return `${value.slice(0, 497).replace(/\s+\S*$/, "")}…`;
}

function estimateReadTime(value: string) {
  const words = value ? value.split(/\s+/).length : 0;
  return `${Math.max(1, Math.ceil(words / 200))} minute read`;
}

function validImageUrl(value: string) {
  return value.startsWith("/images/") || /^https:\/\//i.test(value);
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
