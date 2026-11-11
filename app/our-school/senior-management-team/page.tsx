import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdmissionsCta } from "@/components/AdmissionsCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InteriorHero } from "@/components/InteriorHero";
import { SectionHeading } from "@/components/SectionHeading";
import { ManagedImage as Image } from "@/components/ManagedImage";
import {
  leadershipHierarchyGroups,
  leadershipMessages,
  seniorManagementTeam,
} from "@/data/leadership";
import {
  getPublicEditablePage,
  getPublicLeadershipProfiles,
  type LeadershipProfile,
} from "@/db/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leadership and Management | Shah Lalji Nangpar Academy",
  description:
    "Explore the governance, academic and operational leadership structure at Shah Lalji Nangpar Academy.",
  alternates: { canonical: "/our-school/senior-management-team" },
};

export default async function SeniorManagementTeamPage() {
  let team: LeadershipProfile[] = seniorManagementTeam.map((member, index) => ({
    ...member,
    id: index + 1,
    photoUrl: null as string | null,
    photoAlt: "",
    updatedAt: "",
  }));
  let boardChair = leadershipMessages.boardChair;
  try {
    team = await getPublicLeadershipProfiles();
  } catch {
    // The bundled profiles keep the page available before the migration runs.
  }
  try {
    boardChair = (await getPublicEditablePage(
      "board-chair-message",
    )) as typeof boardChair;
  } catch {
    // The bundled Board Chair profile remains available before setup completes.
  }

  return (
    <>
      <Header />
      <main>
        <InteriorHero
          eyebrow="Leadership and Management"
          title={
            <>
              A clear structure for{" "}
              <span className="italic text-school-gold">every responsibility.</span>
            </>
          }
          description="From governance and school administration to academic and operational leadership, each level works together in service of learners and families."
          image="/images/school/school-event-leadership.webp"
          imageKey="leadership.smt.hero"
          imageAlt="School leaders engaging with learners during an academy event"
          imagePosition="object-center"
        />

        <section className="bg-school-cream py-14 sm:py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="How leadership connects"
                title={
                  <>
                    Clear responsibility.{" "}
                    <span className="italic text-school-navy">
                      Shared direction.
                    </span>
                  </>
                }
              />
            </div>
            <div className="space-y-5 text-base leading-8 text-school-muted lg:col-span-5 lg:col-start-8">
              <p>
                The Board provides governance, the School Administrator leads
                whole-school execution, and academic heads guide each stage of
                the learner journey.
              </p>
              <p>
                Deputy, co-curricular and operational leaders then turn that
                direction into consistent daily practice across the academy.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="relative before:absolute before:bottom-16 before:left-1/2 before:top-16 before:w-px before:-translate-x-1/2 before:bg-school-navy/25">
              {leadershipHierarchyGroups.map((group, groupIndex) => {
                const members = team.filter(
                  (member) => member.hierarchyGroup === group.key,
                );
                if (members.length === 0) return null;
                const singleLevel =
                  group.key === "governance" ||
                  group.key === "administration";
                return (
                  <HierarchyLevel
                    key={group.key}
                    number={String(groupIndex + 1).padStart(2, "0")}
                    title={group.label}
                    description={group.description}
                    single={singleLevel}
                  >
                    {members.map((member, index) => (
                      <LeadershipCard
                        key={member.slug}
                        member={member}
                        position={index + 1}
                        fallbackImage={
                          member.slug === "board-chair"
                            ? {
                                src: boardChair.image,
                                alt: boardChair.imageAlt,
                                imageKey: "leadership.board-chair.portrait",
                                position:
                                  boardChair.imagePosition ?? "object-center",
                              }
                            : undefined
                        }
                      />
                    ))}
                  </HierarchyLevel>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-school-navy py-14 text-white sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-10">
            <div className="lg:col-span-7">
              <p className="text-[0.67rem] font-bold uppercase tracking-[0.18em] text-school-gold">
                Governance and administration
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                Read directly from the academy’s leadership.
              </h2>
            </div>
            <div className="grid gap-3 lg:col-span-4 lg:col-start-9">
              {[
                {
                  label: "Message from the Board Chair",
                  href: "/our-school/board-chair-message",
                },
                {
                  label: "Message from the School Administrator",
                  href: "/our-school/school-administrator-message",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between border border-white/20 px-5 py-4 text-[0.67rem] font-bold uppercase tracking-[0.13em] text-white transition-colors hover:border-school-gold hover:text-school-gold"
                >
                  {link.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AdmissionsCta />
      </main>
      <Footer />
    </>
  );
}

function HierarchyLevel({
  number,
  title,
  description,
  single,
  children,
}: {
  number: string;
  title: string;
  description: string;
  single: boolean;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-fit max-w-2xl bg-white px-5 text-center sm:px-8">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-school-navy/20 bg-school-cream text-[0.62rem] font-bold tracking-[0.12em] text-school-navy">
          {number}
        </span>
        <div className="mt-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-school-red">
            Leadership level
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-0.025em] text-school-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-school-muted">
            {description}
          </p>
        </div>
      </div>
      <div
        className={`relative mx-auto mt-8 grid gap-6 pt-8 sm:mt-10 ${
          single
            ? "max-w-md grid-cols-1"
            : "max-w-6xl sm:grid-cols-3 sm:before:absolute sm:before:inset-x-[16.666%] sm:before:top-0 sm:before:h-px sm:before:bg-school-navy/25"
        }`}
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div
                key={index}
                className={`relative ${
                  single
                    ? "before:absolute before:-top-8 before:left-1/2 before:h-8 before:w-px before:-translate-x-1/2 before:bg-school-navy/25"
                    : "sm:before:absolute sm:before:-top-8 sm:before:left-1/2 sm:before:h-8 sm:before:w-px sm:before:-translate-x-1/2 sm:before:bg-school-navy/25"
                }`}
              >
                {child}
              </div>
            ))
          : (
              <div className="relative before:absolute before:-top-8 before:left-1/2 before:h-8 before:w-px before:-translate-x-1/2 before:bg-school-navy/25">
                {children}
              </div>
            )}
      </div>
    </section>
  );
}

function LeadershipCard({
  member,
  position,
  fallbackImage,
}: {
  member: LeadershipProfile;
  position: number;
  fallbackImage?: {
    src: string;
    alt: string;
    imageKey: string;
    position: string;
  };
}) {
  const memberInitials = member.confirmed
    ? initials(member.name)
    : initials(member.role);

  return (
    <article
      className={`overflow-hidden border-b border-r border-school-navy/15 ${
        member.confirmed ? "bg-white" : "bg-school-cream/60"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {member.photoUrl ? (
          // Preserve the complete uploaded portrait in a consistent frame.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={member.photoAlt || `${member.name}, ${member.role}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : fallbackImage ? (
          <Image
            src={fallbackImage.src}
            imageKey={fallbackImage.imageKey}
            alt={fallbackImage.alt}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 420px"
            className={`object-contain ${fallbackImage.position}`}
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-full items-center justify-center bg-school-navy font-serif text-5xl text-white/85"
          >
            {memberInitials}
          </span>
        )}
        <span className="absolute right-4 top-4 bg-white px-3 py-2 text-[0.62rem] font-bold tracking-[0.16em] text-school-navy/35">
          {String(position).padStart(2, "0")}
        </span>
      </div>
      <div className="p-6 sm:p-7">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-school-red">
          {member.area}
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-tight text-school-ink">
          {member.name}
        </h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-school-navy">
          {member.role}
        </p>
        <p className="mt-5 text-sm leading-7 text-school-muted">
          {member.description}
        </p>
      </div>
    </article>
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
