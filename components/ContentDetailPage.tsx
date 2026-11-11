import Link from "next/link";
import { ArrowUpRight, Check, FileDown } from "lucide-react";
import { Fragment } from "react";
import { AdmissionsCta } from "@/components/AdmissionsCta";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InteriorHero } from "@/components/InteriorHero";
import { ManagedImage as Image } from "@/components/ManagedImage";
import { SectionHeading } from "@/components/SectionHeading";
import type { ContentPage } from "@/data/content-pages";

type ContentDetailPageProps = {
  page: ContentPage;
};

export function ContentDetailPage({ page }: ContentDetailPageProps) {
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
          image={page.hero.image}
          imageKey={`content.${page.route.slice(1).replaceAll("/", ".")}.hero`}
          imageAlt={page.hero.imageAlt}
          imagePosition={page.hero.imagePosition}
        />

        <section className="bg-school-cream py-14 sm:py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow={page.introduction.eyebrow}
                title={
                  <>
                    {page.introduction.title}{" "}
                    {page.introduction.accent ? (
                      <span className="italic text-school-navy">
                        {page.introduction.accent}
                      </span>
                    ) : null}
                  </>
                }
              />
            </div>
            <div className="space-y-5 text-base leading-8 text-school-muted lg:col-span-5 lg:col-start-8">
              {page.introduction.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div
            className={`mx-auto mt-10 grid max-w-[1440px] border-l border-t border-school-navy/15 px-4 sm:mt-14 sm:px-6 lg:mt-16 lg:px-10 ${
              page.highlights.length === 4
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "md:grid-cols-3"
            }`}
          >
            {page.highlights.map((highlight) => (
              <article
                key={highlight.label}
                className="border-b border-r border-school-navy/15 bg-white p-6 sm:min-h-52 sm:p-8"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-school-red">
                  {highlight.label}
                </p>
                <p className="mt-5 font-serif text-3xl leading-tight text-school-ink sm:mt-8 sm:text-4xl">
                  {highlight.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-school-muted">
                  {highlight.note}
                </p>
              </article>
            ))}
          </div>

          {page.document ? (
            <div className="mx-auto mt-12 max-w-[1360px] px-4 sm:px-6 lg:px-0">
              <div className="grid gap-7 border-l-4 border-school-gold bg-school-navy p-7 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-school-gold">
                    Official document
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                    {page.document.label}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
                    {page.document.description}
                  </p>
                </div>
                <a
                  href={downloadableDocumentUrl(
                    page.document.url,
                    page.document.fileName,
                  )}
                  download={page.document.fileName}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[3px] bg-white px-6 py-3 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-school-navy transition-colors hover:bg-school-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <FileDown aria-hidden="true" className="size-4" />
                  Download PDF
                </a>
              </div>
            </div>
          ) : null}
        </section>

        {page.photoStory ? (
          <section className="bg-school-stone pb-12 pt-14 sm:pb-16 sm:pt-20 lg:pt-28">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-20">
                <div className="lg:col-span-6">
                  <SectionHeading
                    eyebrow={page.photoStory.eyebrow}
                    title={page.photoStory.title}
                  />
                </div>
                <p className="text-base leading-8 text-school-muted lg:col-span-5 lg:col-start-8">
                  {page.photoStory.description}
                </p>
              </div>

              <div className="mt-10 grid gap-px overflow-hidden border border-school-navy/15 bg-school-navy/15 sm:mt-14 lg:grid-cols-12">
                {page.photoStory.cards.map((card, index) => (
                  <figure
                    key={card.title}
                    className={`group flex h-full flex-col bg-white ${
                      index === 0
                        ? "lg:col-span-7 lg:row-span-2"
                        : "lg:col-span-5"
                    }`}
                  >
                    <div
                      className={`relative bg-school-cream ${
                        index === 0
                          ? "aspect-[4/3] lg:aspect-auto lg:min-h-[610px] lg:flex-1"
                          : "aspect-[16/9] lg:min-h-[280px]"
                      }`}
                    >
                      <Image
                        src={card.image}
                        imageKey={`content.${page.route
                          .slice(1)
                          .replaceAll("/", ".")}.development.${index + 1}`}
                        alt={card.imageAlt}
                        fill
                        unoptimized
                        sizes={
                          index === 0
                            ? "(max-width: 1024px) 100vw, 58vw"
                            : "(max-width: 1024px) 100vw, 42vw"
                        }
                        className="object-contain"
                      />
                    </div>
                    <figcaption className="border-t border-school-navy/10 p-6 sm:p-7">
                      <p className="text-[0.64rem] font-bold uppercase tracking-[0.17em] text-school-red">
                        {card.eyebrow}
                      </p>
                      <p className="mt-3 font-serif text-2xl leading-tight text-school-ink sm:text-3xl">
                        {card.title}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section
          className={
            page.photoStory
              ? "bg-white pb-14 pt-12 sm:pb-20 sm:pt-16 lg:pb-28"
              : "bg-white py-14 sm:py-20 lg:py-28"
          }
        >
          <div className="mx-auto max-w-[1440px] divide-y divide-school-navy/15 px-4 sm:px-6 lg:px-10">
            {page.sections.map((section, index) => {
              const hasMedia = Boolean(section.media?.length);

              return (
                <Fragment key={section.title}>
                  <article
                    className={`grid gap-7 py-11 first:pt-0 sm:gap-9 sm:py-14 lg:grid-cols-12 lg:py-20 ${
                      hasMedia ? "lg:gap-10 xl:gap-14" : "lg:gap-20"
                    }`}
                  >
                    <div className={hasMedia ? "lg:col-span-4" : "lg:col-span-5"}>
                      <p className="text-[0.67rem] font-bold uppercase tracking-[0.18em] text-school-red">
                        {section.eyebrow ?? `Section 0${index + 1}`}
                      </p>
                      <h2 className="mt-4 max-w-xl font-serif text-3xl leading-[1.04] tracking-[-0.03em] text-school-ink sm:text-5xl sm:leading-[1.02] sm:tracking-[-0.035em]">
                        {section.title}
                      </h2>
                    </div>
                    <div
                      className={
                        hasMedia
                          ? "lg:col-span-4"
                          : "lg:col-span-6 lg:col-start-7"
                      }
                    >
                      <div className="space-y-5 text-base leading-8 text-school-muted">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      {section.points?.length ? (
                        <ul className="mt-8 border-t border-school-navy/15">
                          {section.points.map((point) => (
                            <li
                              key={point}
                              className="flex gap-4 border-b border-school-navy/15 py-4 text-sm leading-6 text-school-ink sm:text-base"
                            >
                              <Check
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-school-red"
                                strokeWidth={1.8}
                              />
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {section.media?.length ? (
                      <div
                        className={`grid gap-3 self-start sm:gap-4 lg:col-span-4 ${
                          section.media.length > 1
                            ? "grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                            : "grid-cols-1"
                        }`}
                      >
                        {section.media.map((media, mediaIndex) => (
                          <figure
                            key={`${media.image}-${mediaIndex}`}
                            className="relative aspect-[4/3] overflow-hidden bg-school-cream"
                          >
                            <Image
                              src={media.image}
                              imageKey={`content.${page.route
                                .slice(1)
                                .replaceAll("/", ".")}.section.${index + 1}.image.${mediaIndex + 1}`}
                              alt={media.imageAlt}
                              fill
                              unoptimized
                              sizes="(max-width: 1024px) 100vw, 32vw"
                              className={`object-contain ${media.imagePosition ?? "object-center"}`}
                            />
                          </figure>
                        ))}
                      </div>
                    ) : null}
                  </article>

                  {page.pullQuote?.afterSection === index + 1 ? (
                    <aside className="relative overflow-hidden bg-school-navy px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                      <div
                        aria-hidden="true"
                        className="absolute -right-16 -top-24 size-72 rounded-full border border-white/10"
                      />
                      <p className="relative text-[0.67rem] font-bold uppercase tracking-[0.19em] text-school-gold">
                        {page.pullQuote.eyebrow}
                      </p>
                      <blockquote className="relative mt-5 max-w-5xl font-serif text-[clamp(2.15rem,5vw,4.9rem)] leading-[1.02] tracking-[-0.04em]">
                        {page.pullQuote.text}
                      </blockquote>
                    </aside>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </section>

        {page.relatedLinks?.length ? (
          <section className="bg-school-stone py-14 sm:py-20 lg:py-28">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
              <SectionHeading
                eyebrow="School leadership"
                title={
                  <>
                    Hear directly from{" "}
                    <span className="italic text-school-navy">
                      those who lead.
                    </span>
                  </>
                }
                description="These are complete pages within this website—no external redirects."
              />
              <div className="mt-12 grid border-l border-t border-school-navy/15 md:grid-cols-3">
                {page.relatedLinks.map((related) => (
                  <Link
                    key={related.href}
                    href={related.href}
                    className="group min-h-[310px] border-b border-r border-school-navy/15 bg-white p-7 transition-colors hover:bg-school-navy hover:text-white sm:p-8"
                  >
                    <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-school-red group-hover:text-school-gold">
                      {related.eyebrow}
                    </p>
                    <h2 className="mt-8 font-serif text-3xl leading-tight text-school-ink transition-colors group-hover:text-white">
                      {related.title}
                    </h2>
                    <p className="mt-5 text-sm leading-7 text-school-muted transition-colors group-hover:text-white/65">
                      {related.description}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-school-navy transition-colors group-hover:text-school-gold">
                      Read the full page
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {page.notice ? (
          <section className="bg-school-navy py-14 text-white sm:py-20 lg:py-24">
            <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-10">
              <div className="lg:col-span-7">
                <p className="text-[0.67rem] font-bold uppercase tracking-[0.19em] text-school-gold">
                  {page.notice.eyebrow}
                </p>
                <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                  {page.notice.title}
                </h2>
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <p className="text-base leading-8 text-white/68">
                  {page.notice.description}
                </p>
                <ButtonLink
                  href={page.notice.actionHref}
                  variant="light"
                  className="mt-7"
                >
                  {page.notice.actionLabel}
                </ButtonLink>
              </div>
            </div>
          </section>
        ) : null}

        <AdmissionsCta
          title="Discover the right next step."
          description="Speak with our admissions team about the programme, entry point and practical information that matter to your family."
        />
      </main>
      <Footer />
    </>
  );
}

function downloadableDocumentUrl(url: string, fileName: string) {
  if (!url.startsWith("https://")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}download=${encodeURIComponent(fileName)}`;
}
