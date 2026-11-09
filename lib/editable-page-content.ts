import type { ContentPage, ContentPageSection } from "@/data/content-pages";
import type { EditablePageKey } from "@/data/editable-pages";
import type { LeadershipMessage } from "@/data/leadership";
import type {
  EnrichmentPage,
  EnrichmentProgrammeArea,
  EnrichmentSchoolSection,
} from "@/data/enrichment";

export function parseEditablePageContent(
  key: EditablePageKey,
  value: unknown,
): LeadershipMessage | ContentPage | EnrichmentPage | null {
  if (key === "fee-structure") return parseFeePage(value);
  if (key === "sports-co-curricular") return parseEnrichmentPage(value);
  return parseLeadershipMessage(value);
}

function parseEnrichmentPage(value: unknown): EnrichmentPage | null {
  if (!record(value) || !record(value.hero) || !record(value.introduction)) {
    return null;
  }
  const hero = value.hero;
  const introduction = value.introduction;
  const programmeAreas = Array.isArray(value.programmeAreas)
    ? value.programmeAreas
        .slice(0, 8)
        .map(parseProgrammeArea)
        .filter(Boolean)
    : [];
  const schoolSections = Array.isArray(value.schoolSections)
    ? value.schoolSections
        .slice(0, 3)
        .map(parseSchoolSection)
        .filter(Boolean)
    : [];

  if (
    !["/school-life", "/sports-and-co-curricular"].includes(
      clean(value.route, 180),
    ) ||
    !clean(hero.eyebrow, 100) ||
    !clean(hero.title, 180) ||
    !clean(hero.description, 700) ||
    !clean(introduction.title, 180) ||
    !stringList(introduction.paragraphs, 8, 3000).length ||
    programmeAreas.length < 1 ||
    schoolSections.length !== 3 ||
    !clean(value.statement, 300) ||
    !clean(value.person, 120) ||
    !clean(value.role, 160)
  ) return null;

  return {
    route: "/sports-and-co-curricular",
    metaTitle: clean(value.metaTitle, 180),
    metaDescription: clean(value.metaDescription, 320),
    hero: {
      eyebrow: clean(hero.eyebrow, 100),
      title: clean(hero.title, 180),
      accent: clean(hero.accent, 120),
      description: clean(hero.description, 700),
    },
    introduction: {
      eyebrow: clean(introduction.eyebrow, 100),
      title: clean(introduction.title, 180),
      accent: clean(introduction.accent, 120),
      paragraphs: stringList(introduction.paragraphs, 8, 3000),
    },
    programmeAreas: programmeAreas as EnrichmentProgrammeArea[],
    schoolSections: schoolSections as EnrichmentSchoolSection[],
    statement: clean(value.statement, 300),
    person: clean(value.person, 120),
    role: clean(value.role, 160),
  };
}

function parseProgrammeArea(value: unknown): EnrichmentProgrammeArea | null {
  if (!record(value)) return null;
  const label = clean(value.label, 30);
  const title = clean(value.title, 160);
  const description = clean(value.description, 700);
  return label && title && description ? { label, title, description } : null;
}

function parseSchoolSection(value: unknown): EnrichmentSchoolSection | null {
  if (!record(value)) return null;
  const label = clean(value.label, 100);
  const stage = clean(value.stage, 160);
  const title = clean(value.title, 180);
  const description = clean(value.description, 900);
  const points = stringList(value.points, 12, 160);
  if (!label || !stage || !title || !description || !points.length) return null;
  return { label, stage, title, description, points };
}

function parseLeadershipMessage(value: unknown): LeadershipMessage | null {
  if (!record(value)) return null;
  const sections = Array.isArray(value.sections)
    ? value.sections.slice(0, 8).map(parseMessageSection).filter(Boolean)
    : [];
  const route = clean(value.route, 180);
  const image = clean(value.image, 500);
  if (
    !route.startsWith("/our-school/") ||
    !clean(value.eyebrow, 100) ||
    !clean(value.title, 160) ||
    !clean(value.description, 600) ||
    !clean(value.person, 120) ||
    !clean(value.role, 120) ||
    !validImageUrl(image) ||
    !clean(value.imageAlt, 220) ||
    sections.length < 1
  ) return null;

  return {
    route,
    metaTitle: clean(value.metaTitle, 180),
    metaDescription: clean(value.metaDescription, 320),
    eyebrow: clean(value.eyebrow, 100),
    title: clean(value.title, 160),
    accent: clean(value.accent, 120),
    description: clean(value.description, 600),
    person: clean(value.person, 120),
    role: clean(value.role, 120),
    image,
    imageAlt: clean(value.imageAlt, 220),
    imagePosition: clean(value.imagePosition, 40) || "object-center",
    sections: sections as LeadershipMessage["sections"],
  };
}

function parseMessageSection(value: unknown) {
  if (!record(value)) return null;
  const paragraphs = stringList(value.paragraphs, 12, 3000);
  if (!paragraphs.length) return null;
  const heading = clean(value.heading, 160);
  return { ...(heading ? { heading } : {}), paragraphs };
}

function parseFeePage(value: unknown): ContentPage | null {
  if (!record(value) || !record(value.hero) || !record(value.introduction)) return null;
  const hero = value.hero;
  const introduction = value.introduction;
  const highlights = Array.isArray(value.highlights)
    ? value.highlights.slice(0, 8).map(parseHighlight).filter(Boolean)
    : [];
  const sections = Array.isArray(value.sections)
    ? value.sections.slice(0, 8).map(parseContentSection).filter(Boolean)
    : [];
  const route = clean(value.route, 180);
  const heroImage = clean(hero.image, 500);
  if (
    route !== "/admissions/fee-structure" ||
    !validImageUrl(heroImage) ||
    !clean(hero.title, 160) ||
    !clean(hero.description, 600) ||
    !clean(introduction.title, 160) ||
    !stringList(introduction.paragraphs, 8, 3000).length ||
    !highlights.length ||
    !sections.length
  ) return null;

  const notice = record(value.notice)
    ? {
        eyebrow: clean(value.notice.eyebrow, 100),
        title: clean(value.notice.title, 180),
        description: clean(value.notice.description, 800),
        actionLabel: clean(value.notice.actionLabel, 100),
        actionHref: clean(value.notice.actionHref, 180),
      }
    : undefined;
  const document = parseFeeDocument(value.document);

  return {
    route,
    metaTitle: clean(value.metaTitle, 180),
    metaDescription: clean(value.metaDescription, 320),
    hero: {
      eyebrow: clean(hero.eyebrow, 100),
      title: clean(hero.title, 160),
      accent: clean(hero.accent, 120),
      description: clean(hero.description, 600),
      image: heroImage,
      imageAlt: clean(hero.imageAlt, 220),
      imagePosition: clean(hero.imagePosition, 40) || "object-center",
    },
    introduction: {
      eyebrow: clean(introduction.eyebrow, 100),
      title: clean(introduction.title, 160),
      accent: clean(introduction.accent, 120),
      paragraphs: stringList(introduction.paragraphs, 8, 3000),
    },
    highlights: highlights as ContentPage["highlights"],
    sections: sections as ContentPage["sections"],
    ...(document ? { document } : {}),
    ...(notice ? { notice } : {}),
  };
}

function parseFeeDocument(value: unknown): ContentPage["document"] | undefined {
  if (!record(value)) return undefined;
  const url = clean(value.url, 700);
  const label = clean(value.label, 160);
  const fileName = clean(value.fileName, 160);
  const description = clean(value.description, 600);
  if (
    !validDocumentUrl(url) ||
    !label ||
    !description ||
    !/^[a-z0-9][a-z0-9._-]*[.]pdf$/i.test(fileName)
  ) return undefined;
  return { url, label, fileName, description };
}

function parseHighlight(value: unknown) {
  if (!record(value)) return null;
  const label = clean(value.label, 120);
  const amount = clean(value.value, 120);
  const note = clean(value.note, 300);
  return label && amount ? { label, value: amount, note } : null;
}

function parseContentSection(value: unknown): ContentPageSection | null {
  if (!record(value)) return null;
  const title = clean(value.title, 180);
  const paragraphs = stringList(value.paragraphs, 8, 3000);
  if (!title || !paragraphs.length) return null;
  const points = stringList(value.points, 30, 300);
  return {
    eyebrow: clean(value.eyebrow, 100),
    title,
    paragraphs,
    ...(points.length ? { points } : {}),
  };
}

function stringList(value: unknown, limit: number, maxLength: number) {
  return Array.isArray(value)
    ? value.map((item) => clean(item, maxLength)).filter(Boolean).slice(0, limit)
    : [];
}

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function validImageUrl(value: string) {
  return value.startsWith("/images/") || /^https:\/\//i.test(value);
}

function validDocumentUrl(value: string) {
  return value.startsWith("/documents/") || /^https:\/\//i.test(value);
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
