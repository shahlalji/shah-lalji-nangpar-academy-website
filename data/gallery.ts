import { photoLibrary } from "@/data/site";

export const gallerySections = [
  {
    key: "eyfs",
    label: "EYFS",
    schoolHref: "/education/eyfs",
    title: "EYFS in pictures",
    description:
      "See play, discovery, early learning and the warm daily routines that shape life across Playgroup, Nursery, Kindergarten and Reception.",
  },
  {
    key: "junior-school",
    label: "Junior School",
    schoolHref: "/education/junior-school",
    title: "Junior School in pictures",
    description:
      "Explore classroom learning, clubs, sport and the shared experiences that help Junior School learners grow in confidence.",
  },
  {
    key: "senior-school",
    label: "Senior School",
    schoolHref: "/education/senior-school",
    title: "Senior School in pictures",
    description:
      "A closer look at academic life, leadership, friendship and wider opportunities across the Senior School.",
  },
  {
    key: "igcse",
    label: "IGCSE",
    schoolHref: "/education/igcse",
    title: "IGCSE in pictures",
    description:
      "See focused study, practical learning and the experiences that support learners through the IGCSE pathway.",
  },
  {
    key: "a-level",
    label: "A-Level",
    schoolHref: "/education/a-level",
    title: "A-Level in pictures",
    description:
      "Discover the independent learning, enrichment and community life that prepare Sixth Form learners for what comes next.",
  },
  {
    key: "sports-and-co-curricular",
    label: "Sports & Co.",
    schoolHref: "/sports-and-co-curricular",
    title: "Sports & Co. in pictures",
    description:
      "Competition, participation, performance and teamwork across sport, swimming, clubs and co-curricular life.",
  },
  {
    key: "whole-school",
    label: "Whole School",
    schoolHref: "/our-school",
    title: "Whole-school moments",
    description:
      "Assemblies, celebrations and shared experiences from across the Shah Lalji Nangpar Academy community.",
  },
] as const;

export type GallerySectionKey = (typeof gallerySections)[number]["key"];

export type GalleryPhoto = {
  id: string | number;
  section: GallerySectionKey;
  title: string;
  caption: string;
  src: string;
  alt: string;
};

export function getGallerySection(value: string) {
  return gallerySections.find((section) => section.key === value) ?? null;
}

export function isGallerySectionKey(value: string): value is GallerySectionKey {
  return gallerySections.some((section) => section.key === value);
}

const defaultAssignments: GallerySectionKey[] = [
  "whole-school",
  "eyfs",
  "junior-school",
  "whole-school",
  "sports-and-co-curricular",
  "senior-school",
  "senior-school",
  "eyfs",
  "eyfs",
  "sports-and-co-curricular",
  "sports-and-co-curricular",
  "sports-and-co-curricular",
  "junior-school",
  "a-level",
  "whole-school",
  "whole-school",
  "whole-school",
];

export const defaultGalleryPhotos: GalleryPhoto[] = photoLibrary.map(
  (photo, index) => ({
    id: `default-${index + 1}`,
    section: defaultAssignments[index] ?? "whole-school",
    title: photo.title,
    caption: photo.category,
    src: photo.src,
    alt: photo.alt,
  }),
);

const relatedFallbacks: Partial<Record<GallerySectionKey, GallerySectionKey[]>> = {
  igcse: ["senior-school", "a-level"],
  "a-level": ["senior-school"],
};

export function getDefaultGalleryPhotos(section?: GallerySectionKey) {
  if (!section) return defaultGalleryPhotos;
  const direct = defaultGalleryPhotos.filter((photo) => photo.section === section);
  if (direct.length >= 3) return direct;
  const related = relatedFallbacks[section] ?? [];
  const additions = defaultGalleryPhotos.filter((photo) =>
    related.includes(photo.section),
  );
  return [...direct, ...additions].slice(0, 6);
}
