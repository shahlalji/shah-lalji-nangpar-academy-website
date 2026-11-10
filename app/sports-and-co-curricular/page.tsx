import type { Metadata } from "next";
import { ManagedImage as Image } from "@/components/ManagedImage";
import { AdmissionsCta } from "@/components/AdmissionsCta";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InteriorHero } from "@/components/InteriorHero";
import { SectionHeading } from "@/components/SectionHeading";
import { enrichmentPage } from "@/data/enrichment";
import { seniorManagementTeam } from "@/data/leadership";
import {
  getPublicEditablePage,
  getPublicLeadershipProfiles,
  type LeadershipProfile,
} from "@/db/dashboard";

export const metadata: Metadata = {
  title: enrichmentPage.metaTitle,
  description: enrichmentPage.metaDescription,
  alternates: { canonical: enrichmentPage.route },
};

export const dynamic = "force-dynamic";

const schoolImages = [
  {
    src: "/images/school/early-years-taekwondo.webp",
    imageKey: "school-life.activity.arts",
    alt: "EYFS learners practising taekwondo together",
  },
  {
    src: "/images/school/cycling-club.webp",
    imageKey: "school-life.activity.leadership",
    alt: "Junior School learners standing with bicycles during an outdoor club activity",
  },
  {
    src: "/images/school/basketball-team.webp",
    imageKey: "school-life.activity.clubs",
    alt: "Senior School basketball players gathered on the indoor court",
  },
] as const;

export default async function SportsAndCoCurricularPage() {
  let page = enrichmentPage;
  let team: LeadershipProfile[] = seniorManagementTeam.map((member, index) => ({
    ...member,
    id: index + 1,
    photoUrl: null,
    photoAlt: "",
    updatedAt: "",
  }));

  const [pageResult, teamResult] = await Promise.allSettled([
    getPublicEditablePage("sports-co-curricular"),
    getPublicLeadershipProfiles(),
  ]);
  if (pageResult.status === "fulfilled") {
    page = pageResult.value as typeof enrichmentPage;
  }
  if (teamResult.status === "fulfilled") {
    const savedProfiles = new Map(
      teamResult.value.map((member) => [member.slug, member]),
    );
    const bundledSlugs = new Set(team.map((member) => member.slug));
    team = [
      ...team.map((member) => savedProfiles.get(member.slug) ?? member),
      ...teamResult.value.filter((member) => !bundledSlugs.has(member.slug)),
    ];
  }

  const savedTeam = team.filter(
    (member) => member.name.trim().toLowerCase() !== "profile to be confirmed",
  );
  const matchesSportsLeadership = (member: LeadershipProfile) => {
    const leadershipTitle = `${member.role} ${member.area}`.toLowerCase();
    return (
      /co[-\s]?curricular/.test(leadershipTitle) ||
      leadershipTitle.includes("head of sports") ||
      leadershipTitle.includes("sports head")
    );
  };
  const departmentHead =
    savedTeam.find((member) => member.slug === "head-co-curricular") ??
    savedTeam.find(matchesSportsLeadership) ??
    team.find((member) => member.slug === "head-co-curricular");
  const departmentHeadName = departmentHead?.name ?? page.person;
  const departmentHeadRole = departmentHead?.role ?? page.role;

  return (
    <>
      <Header />
      <main>
        <InteriorHero
          eyebrow={page.hero.eyebrow}
          title={
            <>
              {page.hero.title}{" "}
              <span className="italic text-school-gold">
                {page.hero.accent}
              </span>
            </>
          }
          description={page.hero.description}
          image="/images/school/sports-day-community.webp"
          imageKey="school-life.hero"
          imageAlt="Learners taking part in an energetic outdoor school activity"
        />

        <section className="bg-school-cream py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-5">
                <SectionHeading
                  eyebrow={page.introduction.eyebrow}
                  title={
                    <>
                      {page.introduction.title}{" "}
                      <span className="italic text-school-navy">
                        {page.introduction.accent}
                      </span>
                    </>
                  }
                />
                <div className="mt-10 max-w-[320px] border-b border-school-navy/15 pb-6">
                  <PersonPortrait
                    name={departmentHeadName}
                    role={departmentHeadRole}
                    photoUrl={departmentHead?.photoUrl ?? null}
                    photoAlt={departmentHead?.photoAlt ?? ""}
                  />
                  <div className="mt-5 border-l-2 border-school-gold pl-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-school-red">
                      Message from
                    </p>
                    <p className="mt-2 font-serif text-2xl text-school-ink">
                      {departmentHeadName}
                    </p>
                    <p className="mt-2 text-[0.66rem] font-bold uppercase leading-6 tracking-[0.14em] text-school-muted">
                      {departmentHeadRole}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6 text-base leading-8 text-school-muted lg:col-span-6 lg:col-start-7">
                {page.introduction.paragraphs.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? "text-lg leading-9 text-school-ink sm:text-xl"
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-16 grid overflow-hidden bg-school-navy lg:grid-cols-12">
              <div className="relative min-h-[380px] lg:col-span-8 lg:min-h-[560px]">
                <Image
                  src="/images/school/swimming-competition.webp"
                  imageKey="school-life.pastoral"
                  alt="Learners competing in marked lanes during a school swimming event"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
              <blockquote className="flex flex-col justify-between p-8 text-white sm:p-10 lg:col-span-4 lg:p-12">
                <span className="font-serif text-6xl leading-none text-school-gold">
                  “
                </span>
                <p className="mt-16 font-serif text-3xl leading-tight tracking-[-0.025em] sm:text-4xl">
                  Success is also the confidence gained, friendships built and
                  character developed along the way.
                </p>
                <p className="mt-10 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/60">
                  Participation · Growth · School spirit
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="bg-school-navy py-20 text-white sm:py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
            <div className="lg:col-span-7">
              <SectionHeading
                eyebrow="Programme landscape"
                title="Many ways to take part."
                description="The department connects physical education, sport, swimming, clubs, competition and performance in one whole-school programme."
                tone="light"
              />

              <div className="mt-12 divide-y divide-white/15 border-y border-white/15">
                {page.programmeAreas.map((area) => (
                  <article
                    key={`${area.label}-${area.title}`}
                    className="grid gap-4 py-7 sm:grid-cols-[70px_1fr] sm:py-8"
                  >
                    <p className="text-[0.68rem] font-bold tracking-[0.18em] text-school-gold">
                      {area.label}
                    </p>
                    <div className="grid gap-3 md:grid-cols-2 md:gap-8">
                      <h2 className="font-serif text-2xl leading-tight sm:text-3xl">
                        {area.title}
                      </h2>
                      <p className="text-sm leading-7 text-white/65">
                        {area.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden bg-white/5 lg:col-span-5 lg:min-h-full">
              <Image
                src="/images/school/swimming-training.webp"
                imageKey="school-life.activity.sport"
                alt="Learners building swimming technique in the school pool"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-school-navy via-school-navy/75 to-transparent px-7 pb-8 pt-24">
                <p className="text-[0.67rem] font-bold uppercase tracking-[0.18em] text-school-gold">
                  Beyond the classroom
                </p>
                <p className="mt-3 max-w-md font-serif text-3xl leading-tight">
                  Participation gives talent somewhere to grow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <SectionHeading
              eyebrow="Explore by school section"
              title={
                <>
                  One programme, shaped for each{" "}
                  <span className="italic text-school-navy">stage.</span>
                </>
              }
              description="The structure below gives every school section its own space. Detailed activities can be added as each programme is confirmed."
            />

            <div className="mt-16 divide-y divide-school-navy/15 border-y border-school-navy/15">
              {page.schoolSections.map((section, index) => {
                const image = schoolImages[index];
                return (
                  <article
                    key={section.label}
                    className="grid gap-0 py-8 first:pt-0 last:pb-0 lg:grid-cols-12 lg:py-14"
                  >
                    <div
                      className={`relative min-h-[360px] overflow-hidden bg-school-cream lg:col-span-6 lg:min-h-[500px] ${
                        index % 2 ? "lg:order-2 lg:col-start-7" : ""
                      }`}
                    >
                      <Image
                        src={image.src}
                        imageKey={image.imageKey}
                        alt={image.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <span className="absolute right-5 top-5 bg-white px-4 py-3 text-[0.65rem] font-bold tracking-[0.17em] text-school-navy">
                        0{index + 1}
                      </span>
                    </div>

                    <div
                      className={`flex items-center py-10 lg:col-span-5 lg:py-14 ${
                        index % 2
                          ? "lg:col-start-1 lg:order-1 lg:pr-16"
                          : "lg:col-start-8 lg:pl-16"
                      }`}
                    >
                      <div>
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-school-red">
                          {section.label}
                        </p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-school-muted">
                          {section.stage}
                        </p>
                        <h2 className="mt-6 font-serif text-4xl leading-[1.02] tracking-[-0.03em] text-school-ink sm:text-5xl">
                          {section.title}
                        </h2>
                        <p className="mt-6 text-base leading-8 text-school-muted">
                          {section.description}
                        </p>
                        <ul className="mt-8 flex flex-wrap gap-2">
                          {section.points.map((point) => (
                            <li
                              key={point}
                              className="border border-school-navy/15 px-3 py-2 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-school-navy"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-school-cream py-20 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-10">
            <div className="lg:col-span-10">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-school-red">
                A message from the department
              </p>
              <blockquote className="mt-6 font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.98] tracking-[-0.045em] text-school-ink">
                “{page.statement}”
              </blockquote>
            </div>
            <div className="lg:col-span-2 lg:text-right">
              <ButtonLink href="/gallery" variant="ghost">
                View the photo gallery
              </ButtonLink>
            </div>
          </div>
        </section>

        <AdmissionsCta />
      </main>
      <Footer />
    </>
  );
}

function PersonPortrait({
  name,
  role,
  photoUrl,
  photoAlt,
}: {
  name: string;
  role: string;
  photoUrl: string | null;
  photoAlt: string;
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-school-navy">
      {photoUrl ? (
        // Leadership portraits are uploaded through the dashboard and may use
        // public Supabase object URLs, so the original file is served directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={photoAlt || `${name}, ${role}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full items-center justify-center font-serif text-6xl text-white/90"
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}

function initials(value: string) {
  return value
    .replace(/^(Mr|Ms|Mrs|Dr)\.?\s+/i, "")
    .split(/\s+/)
    .filter((part) => !["of", "the", "and"].includes(part.toLowerCase()))
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
