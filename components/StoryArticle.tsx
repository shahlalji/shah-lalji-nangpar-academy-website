import { ManagedImage as Image } from "@/components/ManagedImage";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoryEngagement } from "@/components/StoryEngagement";
import type { Story } from "../data/stories";

type StoryArticleProps = {
  story: Story;
};

export function StoryArticle({ story }: StoryArticleProps) {
  return (
    <>
      <Header />
      <main>
        <header className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-school-navy text-white sm:min-h-[680px]">
          <Image
            src={story.image}
            imageKey={`story.${story.slug}.hero`}
            alt={story.alt}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,29,60,0.96)_0%,rgba(3,29,60,0.78)_48%,rgba(3,29,60,0.25)_100%),linear-gradient(0deg,rgba(3,29,60,0.88)_0%,transparent_62%)]" />
          <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-12 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pb-24">
            <Link
              href="/stories"
              className="inline-flex items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.17em] text-white/60 transition-colors hover:text-school-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-school-gold"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              All stories
            </Link>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-school-gold sm:mt-10 sm:gap-4 sm:text-[0.66rem] sm:tracking-[0.16em]">
              <span>{story.category}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-2 text-white/62">
                <Clock3 aria-hidden="true" className="size-4" />
                {story.readTime}
              </span>
              {story.publishedAt ? (
                <span className="flex items-center gap-2 text-white/62">
                  <CalendarDays aria-hidden="true" className="size-4" />
                  {formatPublishedDate(story.publishedAt)}
                </span>
              ) : null}
              <span className="flex items-center gap-2 text-white/70">
                <UserRound aria-hidden="true" className="size-4" />
                By {story.author}
              </span>
            </div>
            <h1 className="mt-5 max-w-[980px] font-serif text-[clamp(2.6rem,8vw,7.7rem)] leading-[0.94] tracking-[-0.045em] sm:mt-6 sm:leading-[0.88] sm:tracking-[-0.055em]">
              {story.title}
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-white/76 sm:text-xl sm:leading-9">
              {story.excerpt}
            </p>
          </div>
        </header>

        <article className="bg-white py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
              <aside className="lg:col-span-3">
                <div className="border-l-2 border-school-gold bg-school-cream p-6 lg:sticky lg:top-28">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-school-red">
                    In this story
                  </p>
                  <ol className="mt-5 space-y-4">
                    {story.sections.map((section, index) => (
                      <li key={section.heading}>
                        <a
                          href={`#section-${index + 1}`}
                          className="text-sm leading-6 text-school-muted transition-colors hover:text-school-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-school-red"
                        >
                          <span className="mr-2 font-bold text-school-red">
                            0{index + 1}
                          </span>
                          {section.heading}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>

              <div className="lg:col-span-8 lg:col-start-5">
                <div className="space-y-14 sm:space-y-20">
                  {story.sections.map((section, index) => (
                    <section
                      key={section.heading}
                      id={`section-${index + 1}`}
                      className="scroll-mt-32"
                    >
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-school-red">
                        0{index + 1}
                      </p>
                      <h2 className="mt-4 font-serif text-3xl leading-[1.04] tracking-[-0.03em] text-school-ink sm:text-5xl sm:leading-[1.02] sm:tracking-[-0.035em]">
                        {section.heading}
                      </h2>
                      <div className="mt-7 space-y-5 text-base leading-8 text-school-muted sm:text-lg sm:leading-9">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      {section.image && section.imageAlt ? (
                        <figure className="mt-10">
                          <div className="relative aspect-[8/5] overflow-hidden bg-school-stone">
                            <Image
                              src={section.image}
                              imageKey={`story.${story.slug}.section.${index + 1}`}
                              alt={section.imageAlt}
                              fill
                              unoptimized
                              sizes="(max-width: 1024px) 100vw, 67vw"
                              className="object-cover"
                            />
                          </div>
                        </figure>
                      ) : null}
                    </section>
                  ))}
                </div>

                <blockquote className="mt-14 border-l-4 border-school-gold bg-school-navy p-6 font-serif text-2xl leading-[1.35] text-white sm:mt-20 sm:p-10 sm:text-3xl">
                  “{story.quote}”
                </blockquote>
              </div>
            </div>
          </div>
        </article>

        <StoryEngagement storySlug={story.slug} />

        <section className="bg-school-red py-14 text-white sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-10">
            <div className="lg:col-span-8">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.19em] text-white/65">
                Continue exploring
              </p>
              <h2 className="mt-5 font-serif text-[clamp(2.3rem,6vw,5.8rem)] leading-[0.97] tracking-[-0.04em] sm:leading-[0.94] sm:tracking-[-0.045em]">
                There is more to discover at SLNA.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
              <ButtonLink href="/stories" variant="light">
                More stories
              </ButtonLink>
              <ButtonLink href="/admissions" variant="outline">
                Explore admissions
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}
