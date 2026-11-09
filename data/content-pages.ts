export type ContentPageSection = {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

export type ContentPage = {
  route: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    image: string;
    imageAlt: string;
    imagePosition?: string;
  };
  introduction: {
    eyebrow: string;
    title: string;
    accent?: string;
    paragraphs: readonly string[];
  };
  highlights: readonly {
    label: string;
    value: string;
    note: string;
  }[];
  photoStory?: {
    eyebrow: string;
    title: string;
    description: string;
    cards: readonly {
      eyebrow: string;
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  sections: readonly ContentPageSection[];
  document?: {
    url: string;
    label: string;
    fileName: string;
    description: string;
  };
  relatedLinks?: readonly {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }[];
  notice?: {
    eyebrow: string;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  };
};

export const contentPages = {
  about: {
    route: "/our-school/about-us",
    metaTitle: "About Us | Shah Lalji Nangpar Academy",
    metaDescription:
      "Explore the history of Shah Lalji Nangpar Academy and the learning community it has grown into in Nakuru.",
    hero: {
      eyebrow: "About Us",
      title: "A Nakuru legacy with a",
      accent: "global outlook.",
      description:
        "A non-profit, co-educational day school serving more than 800 learners from EYFS through A-Level within one connected community.",
      image: "/images/school/campus-assembly.webp",
      imageAlt: "SLNA learners gathered in the academy courtyard",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "Our history",
      title: "A shared vision became",
      accent: "a school.",
      paragraphs: [
        "The vision for Shah Lalji Nangpar Academy took shape in 1988–1989 through the educational work of the Visa Oshwal Community. The Nangpar Raimal family of Nakuru Industries supported the project with land and substantial assistance.",
        "Community contributions helped the original Nursery, Primary and Secondary blocks open in January 1994 with approximately 200 learners. From that beginning, the academy has grown into a connected school community serving more than 800 learners from EYFS through A-Level.",
      ],
    },
    highlights: [
      {
        label: "Opened",
        value: "1994",
        note: "The original three school blocks opened together",
      },
      {
        label: "Learners",
        value: "800+",
        note: "From EYFS through A-Level",
      },
      {
        label: "Pathway",
        value: "Cambridge",
        note: "Early learning to Sixth Form",
      },
      {
        label: "School type",
        value: "Non-profit",
        note: "A co-educational day school in Nakuru",
      },
    ],
    photoStory: {
      eyebrow: "A school in motion",
      title: "Growth you can see.",
      description:
        "The academy’s development is reflected in a campus that brings learning, community life and wider opportunity together. These spaces tell the story of a school that has continued to grow around its learners.",
      cards: [
        {
          eyebrow: "The campus",
          title: "A place built around community",
          image: "/images/school/campus-assembly.webp",
          imageAlt: "Learners gathered for assembly in the school courtyard",
        },
        {
          eyebrow: "Wider opportunity",
          title: "Facilities that extend learning",
          image: "/images/school/swimming-competition.webp",
          imageAlt: "Learners competing in the school swimming pool",
        },
        {
          eyebrow: "Today",
          title: "One journey from EYFS to A-Level",
          image: "/images/school/senior-students-community.webp",
          imageAlt: "Senior students together in their red school blazers",
        },
      ],
    },
    sections: [
      {
        eyebrow: "How the campus grew",
        title: "Development with purpose.",
        paragraphs: [
          "The campus expanded beyond its original teaching blocks to include an international-standard auditorium, a swimming pool and broad indoor and outdoor sports facilities.",
          "Each stage of development has supported the same purpose: widening access to high-quality education and giving learners space to study, create, compete and grow.",
        ],
      },
      {
        eyebrow: "The academy today",
        title: "One community across every stage.",
        paragraphs: [
          "Learners progress through a connected Cambridge educational journey while benefiting from specialist teaching, attentive pastoral care and opportunities beyond the classroom.",
          "The academy continues to balance affordability, educational quality and preparation for further study, leadership and life.",
        ],
        points: [
          "EYFS: Playgroup, Nursery, Kindergarten and Reception",
          "Junior School",
          "Senior School and IGCSE",
          "A-Level Sixth Form",
        ],
      },
      {
        eyebrow: "What guides us",
        title: "Excellence supported by care.",
        paragraphs: [
          "Academic ambition and personal wellbeing are treated as inseparable. Committed educators, varied co-curricular opportunities and strong relationships with families help learners build confidence and a lasting love of learning.",
          "Safeguarding, respect and service remain central to school life, creating an environment where young people feel secure, challenged and ready for the opportunities ahead.",
        ],
        points: [
          "Purposeful learning and continuous improvement",
          "Safeguarding, wellbeing and pastoral support",
          "Partnership between learners, families and staff",
          "Character, responsibility and service",
        ],
      },
    ],
    relatedLinks: [
      {
        eyebrow: "Board of Governors",
        title: "Message from the Board Chair",
        description:
          "Read Mr Rajen Shah’s full welcome and his vision for learning, character and community.",
        href: "/our-school/board-chair-message",
      },
      {
        eyebrow: "School administration",
        title: "Message from the School Administrator",
        description:
          "Read Ms Alice Okidia’s full message on safeguarding, wellbeing, academic ambition and partnership.",
        href: "/our-school/school-administrator-message",
      },
      {
        eyebrow: "Our people",
        title: "Leadership and Management",
        description:
          "See how governance, academic and operational leaders connect across the academy.",
        href: "/our-school/senior-management-team",
      },
    ],
  },
  eyfs: {
    route: "/education/eyfs",
    metaTitle: "EYFS | Shah Lalji Nangpar Academy",
    metaDescription:
      "Discover the child-centred EYFS programme across Playgroup, Nursery, Kindergarten and Reception at Shah Lalji Nangpar Academy.",
    hero: {
      eyebrow: "EYFS",
      title: "Curiosity starts",
      accent: "here.",
      description:
        "A warm, play-rich and inquiry-led beginning across Playgroup, Nursery, Kindergarten and Reception.",
      image: "/images/school/early-years-fruit-learning.webp",
      imageAlt: "EYFS learners exploring fruit with their teachers",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "Four connected classes",
      title: "A confident first",
      accent: "step.",
      paragraphs: [
        "The EYFS programme spans Playgroup, Nursery, Kindergarten and Reception, giving every child a clear and carefully supported progression into Junior School.",
        "Children learn through purposeful play, investigation, creative expression and positive relationships. The programme supports communication, early literacy and numeracy, physical development and growing independence.",
      ],
    },
    highlights: [
      {
        label: "Classes",
        value: "Four",
        note: "Playgroup, Nursery, Kindergarten and Reception",
      },
      {
        label: "Timetable",
        value: "Flexible",
        note: "Half-day and full-day options",
      },
      {
        label: "Approach",
        value: "Inquiry-led",
        note: "Learning through play and exploration",
      },
    ],
    sections: [
      {
        eyebrow: "Progression",
        title: "Four classes, one thoughtful journey.",
        paragraphs: [
          "Each class builds naturally on the last, with experiences shaped around children’s changing language, social, physical and learning needs.",
        ],
        points: [
          "Playgroup",
          "Nursery",
          "Kindergarten",
          "Reception",
        ],
      },
      {
        eyebrow: "How children learn",
        title: "Active discovery, thoughtful guidance.",
        paragraphs: [
          "Learning experiences invite children to ask questions, collaborate and make connections with the world around them. Montessori-informed activities support fine and gross motor development in the youngest classes.",
          "Teachers observe each child carefully and shape experiences that build language, number confidence, social skills, creativity and a positive sense of self.",
        ],
        points: [
          "Child-centred and inquiry-based learning",
          "Social inclusion and collaborative play",
          "Holistic physical, emotional and cognitive development",
          "A caring transition into Junior School",
        ],
      },
      {
        eyebrow: "Beyond the classroom",
        title: "Movement, music and imagination.",
        paragraphs: [
          "Arts, crafts and music are woven into the school week. Children can also take part in age-appropriate activities that help them build coordination, confidence and joy in participation.",
        ],
        points: [
          "Taekwondo",
          "Swimming",
          "Ballet and movement",
          "Afternoon clubs and activities",
        ],
      },
    ],
  },
  juniorSchool: {
    route: "/education/junior-school",
    metaTitle: "Junior School | Shah Lalji Nangpar Academy",
    metaDescription:
      "Explore the broad, inquiry-led Junior School programme from Year 1 to Year 6 at Shah Lalji Nangpar Academy.",
    hero: {
      eyebrow: "Junior School",
      title: "Strong foundations for",
      accent: "growing minds.",
      description:
        "An engaging primary programme from Year 1 to Year 6 that builds knowledge, inquiry, confidence and independence.",
      image: "/images/school/chess-club.webp",
      imageAlt: "Junior School learners concentrating during a chess activity",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "Primary education",
      title: "Broad learning.",
      accent: "Real progress.",
      paragraphs: [
        "Junior School follows a British Curriculum approach adapted to the academy’s international and Kenyan context. Learners are encouraged to investigate, communicate clearly and apply what they know.",
        "Regular classroom assessment in core subjects helps teachers understand progress, respond to individual needs and prepare learners confidently for the next stage.",
      ],
    },
    highlights: [
      {
        label: "Year groups",
        value: "Year 1–6",
        note: "A connected primary journey",
      },
      {
        label: "Curriculum",
        value: "Broad",
        note: "Core, creative and practical subjects",
      },
      {
        label: "Progress",
        value: "Monitored",
        note: "Regular and annual assessments",
      },
    ],
    sections: [
      {
        eyebrow: "Curriculum",
        title: "Knowledge, skills and curiosity.",
        paragraphs: [
          "The programme develops secure foundations in English, Mathematics and Science while giving learners a wider understanding of people, places, culture, technology and creativity.",
        ],
        points: [
          "English Language and Literature",
          "Mathematics and Science",
          "Geography and History",
          "Art and Design, Music and Physical Education",
          "ICT and French",
        ],
      },
      {
        eyebrow: "Enrichment",
        title: "Interests become strengths.",
        paragraphs: [
          "Clubs, sport and the arts give learners space to collaborate, practise discipline and discover new interests. Specialist coaching and inter-school opportunities add challenge and a sense of belonging.",
        ],
        points: [
          "STEM and environmental activities",
          "Drama, theatre and visual art",
          "Public speaking and debate",
          "Team and individual sports",
          "Creative and performing arts",
        ],
      },
    ],
  },
  seniorSchool: {
    route: "/education/senior-school",
    metaTitle: "Senior School | Shah Lalji Nangpar Academy",
    metaDescription:
      "Learn about Cambridge Lower Secondary and the IGCSE pathway in Senior School at Shah Lalji Nangpar Academy.",
    hero: {
      eyebrow: "Senior School",
      title: "Depth, direction and",
      accent: "independence.",
      description:
        "A purposeful journey through Cambridge Lower Secondary in Years 7–9 and the IGCSE programme in Years 10–11.",
      image: "/images/school/outdoor-study.webp",
      imageAlt: "A Senior School learner focused during an outdoor study session",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "Senior programme",
      title: "Challenge with",
      accent: "support.",
      paragraphs: [
        "Senior School builds on the foundations of primary education through an adapted UK National Curriculum and the Cambridge pathway. Learners deepen subject knowledge while developing judgement, responsibility and independent study habits.",
        "The programme balances classroom teaching with practical work, educational experiences, co-curricular activities and close pastoral support.",
      ],
    },
    highlights: [
      {
        label: "Lower Secondary",
        value: "Years 7–9",
        note: "Broad Cambridge progression",
      },
      {
        label: "IGCSE",
        value: "Years 10–11",
        note: "Internationally recognised qualifications",
      },
      {
        label: "Next step",
        value: "A-Level",
        note: "Preparation for focused Sixth Form study",
      },
    ],
    sections: [
      {
        eyebrow: "Cambridge Lower Secondary",
        title: "A secure bridge into specialist study.",
        paragraphs: [
          "Years 7–9 consolidate prior learning and introduce greater subject depth. The Cambridge Checkpoint framework provides an international benchmark and helps learners, families and teachers understand progress.",
          "Students are encouraged to think critically, communicate with confidence and apply their learning across different contexts.",
        ],
        points: [
          "English and Mathematics",
          "Sciences",
          "Humanities and modern languages",
          "Technical and creative subjects",
          "Physical education and personal development",
        ],
      },
      {
        eyebrow: "IGCSE preparation",
        title: "Choices that open future pathways.",
        paragraphs: [
          "In Years 10–11, learners combine compulsory subjects with carefully selected options. Academic and career guidance helps each student build a programme that reflects their strengths and future plans.",
        ],
        points: [
          "Subject selection guidance",
          "Practical and coursework-based learning where required",
          "Examination preparation and study skills",
          "Progression into A-Level and other post-16 pathways",
        ],
      },
    ],
  },
  igcse: {
    route: "/education/igcse",
    metaTitle: "IGCSE | Shah Lalji Nangpar Academy",
    metaDescription:
      "Explore the flexible two-year Cambridge IGCSE programme offered in Years 10–11 at Shah Lalji Nangpar Academy.",
    hero: {
      eyebrow: "IGCSE",
      title: "Globally recognised.",
      accent: "Personally shaped.",
      description:
        "A rigorous two-year programme in Years 10–11 that combines essential core subjects with carefully chosen options.",
      image: "/images/school/senior-students-community.webp",
      imageAlt: "Senior learners together in their red school blazers",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "IGCSE at SLNA",
      title: "A flexible route to",
      accent: "future study.",
      paragraphs: [
        "Most learners take between seven and nine IGCSE subjects. Experienced teachers and career guidance help each student select a balanced combination that supports their interests and longer-term ambitions.",
        "Assessment varies by subject and may include written examinations, oral work, practical assessment and coursework. Throughout the programme, learners strengthen analysis, organisation, technical understanding and independent study.",
      ],
    },
    highlights: [
      {
        label: "Duration",
        value: "2 years",
        note: "Years 10 and 11",
      },
      {
        label: "Typical load",
        value: "7–9",
        note: "Compulsory and optional subjects",
      },
      {
        label: "Progression",
        value: "A-Level",
        note: "A strong base for advanced study",
      },
    ],
    sections: [
      {
        eyebrow: "Subject framework",
        title: "Core confidence, meaningful choice.",
        paragraphs: [
          "Every programme includes Mathematics and English Language, alongside at least one Science, one Humanities subject and one Technical or creative option.",
        ],
        points: [
          "Mathematics",
          "English Language and Literature",
          "Biology, Chemistry and Physics",
          "Business Studies and Economics",
          "French and Swahili",
          "Humanities, technology and creative options",
        ],
      },
      {
        eyebrow: "Preparation",
        title: "More than examination results.",
        paragraphs: [
          "Teaching is closely aligned with Cambridge syllabus and assessment expectations, but the programme also develops the habits learners need for advanced study: intellectual curiosity, resilience and confident independent work.",
          "Successful completion provides a recognised foundation for A-Level and other international post-16 routes.",
        ],
        points: [
          "Experienced subject specialists",
          "Clear coursework and examination guidance",
          "Academic and careers counselling",
          "Bursary consideration for exceptional academic performance",
        ],
      },
    ],
  },
  aLevel: {
    route: "/education/a-level",
    metaTitle: "A-Level Sixth Form | Shah Lalji Nangpar Academy",
    metaDescription:
      "Discover the two-year Cambridge A-Level Sixth Form programme and university preparation at Shah Lalji Nangpar Academy.",
    hero: {
      eyebrow: "A-Level Sixth Form",
      title: "Focused study.",
      accent: "Wider horizons.",
      description:
        "An internationally recognised two-year programme that helps students specialise, work independently and prepare for university.",
      image: "/images/school/museum-learning-trip.webp",
      imageAlt: "Senior learners taking part in an educational museum visit",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "A-Level overview",
      title: "Specialist learning with",
      accent: "personal guidance.",
      paragraphs: [
        "Sixth Form students typically choose three or four subjects aligned with their strengths, interests and possible career direction. Small classes, tutorials and close academic guidance support the transition to more independent study.",
        "The programme normally includes AS-Level assessment in the first year and completion of the full A-Level in the second. Cambridge qualifications support applications to universities in Kenya and around the world.",
      ],
    },
    highlights: [
      {
        label: "Duration",
        value: "2 years",
        note: "AS and A2 progression",
      },
      {
        label: "Subject focus",
        value: "3–4",
        note: "A personalised combination",
      },
      {
        label: "Destination",
        value: "Global",
        note: "University and career preparation",
      },
    ],
    sections: [
      {
        eyebrow: "Subjects",
        title: "Options for specialists and generalists.",
        paragraphs: [
          "Students can build a focused programme around a clear career goal or retain breadth while exploring several academic interests. Final combinations depend on timetable availability and entry requirements.",
        ],
        points: [
          "Mathematics, Biology, Physics and Chemistry",
          "Business Studies, Economics and Accounting",
          "English Language and English Literature",
          "Psychology, Geography and History",
          "French and Global Perspectives",
          "IT, Art and Design, Music and Physical Education",
        ],
      },
      {
        eyebrow: "Sixth Form support",
        title: "Independent, never unsupported.",
        paragraphs: [
          "Students receive individual academic advice, pastoral support and regular tutorials. Careers counselling helps them research suitable courses, understand entry requirements and prepare thoughtful university applications.",
        ],
        points: [
          "Specialist subject teaching",
          "Small-class attention",
          "University application guidance",
          "Career planning and subject-choice support",
        ],
      },
    ],
  },
  feeStructure: {
    route: "/admissions/fee-structure",
    metaTitle: "Fee Structure | Shah Lalji Nangpar Academy",
    metaDescription:
      "Review the official 2026-2027 fee structure for Shah Lalji Nangpar Academy and download the complete schedule.",
    hero: {
      eyebrow: "Fee Structure",
      title: "Clear information for",
      accent: "families.",
      description:
        "The published September 2026-2027 fee schedule, with tuition by school stage, additional charges and payment guidance.",
      image: "/images/school/campus-assembly.webp",
      imageAlt: "The SLNA learning community gathered on campus",
      imagePosition: "object-center",
    },
    introduction: {
      eyebrow: "September 2026-2027",
      title: "Plan with",
      accent: "confidence.",
      paragraphs: [
        "The figures below reproduce the academy's official fee structure for the 2026-2027 academic year, covering EYFS, Junior School, Senior School and optional activities.",
        "Please use the downloadable official document for payment guidelines, important notes and account details. The Accounts Office can clarify which charges apply to an individual learner.",
      ],
    },
    highlights: [
      {
        label: "Interview / assessment",
        value: "KES 5,000",
        note: "Applicable across the three schools",
      },
      {
        label: "Admission fee",
        value: "KES 10,000",
        note: "Applicable across the three schools",
      },
      {
        label: "Academic year",
        value: "2026-2027",
        note: "Published September schedule",
      },
    ],
    sections: [
      {
        eyebrow: "EYFS",
        title: "Early learning fees.",
        paragraphs: [
          "Published fees for the academy's four EYFS classes.",
        ],
        points: [
          "Playgroup - KES 33,100",
          "Nursery - KES 47,100",
          "Kindergarten - KES 51,500",
          "Reception - KES 56,700",
        ],
      },
      {
        eyebrow: "Junior School",
        title: "Years 1 to 6.",
        paragraphs: [
          "Published fees are grouped by year level within Junior School.",
        ],
        points: [
          "Years 1 and 2 - KES 58,800",
          "Years 3 and 4 - KES 70,200",
          "Years 5 and 6 - KES 84,800",
        ],
      },
      {
        eyebrow: "Senior School",
        title: "Years 7 to 13.",
        paragraphs: [
          "Published fees for Senior School, IGCSE and Sixth Form year groups.",
        ],
        points: [
          "Year 7 - KES 90,750",
          "Year 8 - KES 101,200",
          "Year 9 - KES 115,940",
          "Year 10 - KES 122,500",
          "Year 11 - KES 127,300",
          "Years 12 and 13 - KES 129,500",
        ],
      },
      {
        eyebrow: "Additional charges",
        title: "Learning and enrolment costs.",
        paragraphs: [
          "These charges apply according to school stage, programme or service.",
        ],
        points: [
          "Junior School caution money - KES 30,000",
          "Senior School caution money - KES 40,000",
          "Student accident policy - KES 1,000 annually",
          "Nursery afternoon programme - KES 6,000",
          "Nursery workbooks - KES 2,500 annually",
          "Kindergarten and Reception workbooks - KES 7,500 annually",
          "Junior School workbooks - KES 5,500 annually",
          "Digital learning resources (Numbots and Bug Club) - KES 1,500 annually",
        ],
      },
      {
        eyebrow: "Optional extras",
        title: "Ten lessons per term.",
        paragraphs: [
          "Optional activities are billed separately. The published examples below cover ten lessons per term.",
        ],
        points: [
          "Peri lessons - KES 7,500",
          "Robotics - KES 6,000",
          "Speech and Drama (LAMDA), excluding exam fees - KES 7,000",
          "Tae Kwo Ndo - KES 3,500",
          "Ballet - KES 3,500",
          "Dance - KES 3,500",
          "Chess - KES 3,500",
          "Tennis - KES 4,500",
        ],
      },
      {
        eyebrow: "Payment guidelines",
        title: "When fees are due.",
        paragraphs: [
          "Individual pupil invoices are issued at the end of each term. All invoices must be settled in full on or before the first day of term, and cash payments are not accepted.",
        ],
        points: [
          "Years 6, 11 and 13 pay the full year's fees in two equal instalments",
          "The first instalment is due on the first day of the academic year",
          "The second instalment is due at the beginning of Term Two",
          "Sibling discounts apply to basic fees for the second and subsequent children",
          "Extra-curricular activities are billed in advance for the following term",
        ],
      },
      {
        eyebrow: "Important notes",
        title: "Please read before payment.",
        paragraphs: [
          "The Board of Governors' complete conditions are contained in the official downloadable document.",
        ],
        points: [
          "The Board may revise fees termly if economic conditions change significantly",
          "Bank charges and dishonoured payment charges are debited to the family fee account",
          "Dishonoured cheques attract a KES 5,000 administration fee",
          "Workbook costs may vary annually because the materials are imported",
          "Caution money is adjusted as learners progress to the next school section",
          "A 3% monthly interest charge may apply to overdue balances under the published conditions",
        ],
      },
    ],
    document: {
      url: "/documents/fees-structure-2026-2027.pdf",
      label: "Download the official fee structure",
      fileName: "SLNA-Fee-Structure-2026-2027.pdf",
      description:
        "Download the complete two-page 2026-2027 schedule, including payment guidelines, important notes and official payment details.",
    },
    notice: {
      eyebrow: "Need clarification?",
      title: "Speak with the Accounts Office before payment.",
      description:
        "For clarification about invoices, applicable charges or payment arrangements, contact the school and request guidance from the Accounts Office.",
      actionLabel: "Contact the school",
      actionHref: "/contact",
    },
  },
} as const satisfies Record<string, ContentPage>;
