export type EnrichmentProgrammeArea = {
  label: string;
  title: string;
  description: string;
};

export type EnrichmentSchoolSection = {
  label: string;
  stage: string;
  title: string;
  description: string;
  points: string[];
};

export type EnrichmentPage = {
  route: "/sports-and-co-curricular";
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
  };
  introduction: {
    eyebrow: string;
    title: string;
    accent: string;
    paragraphs: string[];
  };
  programmeAreas: EnrichmentProgrammeArea[];
  schoolSections: EnrichmentSchoolSection[];
  statement: string;
  person: string;
  role: string;
};

export const enrichmentPage: EnrichmentPage = {
  route: "/sports-and-co-curricular",
  metaTitle:
    "Sports & Co-curricular | Shah Lalji Nangpar Academy",
  metaDescription:
    "Explore sport, swimming, clubs, competition and co-curricular opportunities across EYFS, Junior School and Senior School at Shah Lalji Nangpar Academy.",
  hero: {
    eyebrow: "Sports & co-curricular",
    title: "Beyond the classroom,",
    accent: "beyond limits.",
    description:
      "A whole-school programme that helps every learner discover their potential, develop their talents and grow through participation.",
  },
  introduction: {
    eyebrow: "Our approach",
    title: "Every learner deserves room to",
    accent: "discover.",
    paragraphs: [
      "At Shah Lalji, we believe that education extends beyond the classroom. Our Sports, Swimming and Co-curricular Department is committed to nurturing well-rounded, confident and resilient learners by providing meaningful opportunities for every student to discover their talents, develop new skills and pursue their passions.",
      "Through a diverse programme of physical education, competitive and recreational sports, swimming, clubs and co-curricular activities, we promote physical fitness, teamwork, discipline, leadership, sportsmanship and personal growth. We encourage every learner to participate, challenge themselves, embrace new experiences and develop a lifelong appreciation for an active and healthy lifestyle.",
      "Our programme provides opportunities for students across all school sections to participate in inter-house competitions, inter-school fixtures, swimming galas, tournaments, performances, clubs and enrichment activities. We celebrate individual achievement while fostering collaboration, respect, resilience and a strong sense of school spirit.",
      "Whether representing the school, learning a new skill or discovering a passion, every learner is encouraged to participate, grow and strive for excellence.",
      "At Shah Lalji, success is measured not only by medals and trophies, but also by the confidence gained, friendships built, lessons learned and character developed along the way.",
    ],
  },
  programmeAreas: [
    {
      label: "01",
      title: "Physical education & sport",
      description:
        "Competitive and recreational opportunities develop fitness, teamwork, discipline, leadership and sportsmanship.",
    },
    {
      label: "02",
      title: "Swimming",
      description:
        "Training and swimming galas give learners opportunities to build skill, confidence, resilience and school spirit.",
    },
    {
      label: "03",
      title: "Clubs & co-curricular",
      description:
        "Clubs and enrichment activities create space to explore interests, learn practical skills and discover new passions.",
    },
    {
      label: "04",
      title: "Competition & performance",
      description:
        "Inter-house events, inter-school fixtures, tournaments and performances let learners challenge themselves and contribute together.",
    },
  ],
  schoolSections: [
    {
      label: "EYFS",
      stage: "Playgroup · Nursery · Kindergarten · Reception",
      title: "A confident start through participation.",
      description:
        "This section is ready to present the age-appropriate sports, swimming and co-curricular opportunities available to our youngest learners as programme details are confirmed.",
      points: ["Movement and sport", "Swimming", "Clubs and enrichment"],
    },
    {
      label: "Junior School",
      stage: "Years 1–6",
      title: "Skills, teamwork and new interests.",
      description:
        "This section is ready to organise Junior School opportunities clearly, helping families see the activities, teams, clubs and competitions available by age group.",
      points: ["Sport and fixtures", "Swimming", "Clubs and performance"],
    },
    {
      label: "Senior School",
      stage: "Years 7–13",
      title: "Challenge, leadership and excellence.",
      description:
        "This section is ready to show Senior School pathways for participation, competition, leadership, performance and enrichment once the detailed programme is approved.",
      points: ["Competitive sport", "Swimming and galas", "Clubs and leadership"],
    },
  ],
  statement:
    "Discover your potential. Develop your talents. Strive for excellence.",
  person: "Jacqueline Ogot",
  role: "HOD Sports, Swimming & Co-curricular",
};
