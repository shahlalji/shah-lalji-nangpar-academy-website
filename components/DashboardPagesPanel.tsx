"use client";

import { FileDown, FileText, Save, Upload } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type {
  DashboardEditablePage,
  DashboardEnrichmentPage,
  DashboardFeePage,
  DashboardLeadershipMessagePage,
} from "@/data/editable-pages";
import {
  getDashboardImageExtension,
  prepareDashboardImage,
} from "@/lib/dashboard-image-upload";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { normalizePublicImageUrl } from "@/lib/public-image-url";

type DashboardPagesPanelProps = {
  onNotice: (message: string) => void;
};

const inputClass =
  "min-h-11 w-full border border-school-navy/15 bg-school-cream px-3 py-2 text-sm font-normal normal-case tracking-normal text-school-ink outline-none placeholder:text-school-muted/60 focus:border-school-red";

export function DashboardPagesPanel({ onNotice }: DashboardPagesPanelProps) {
  const [pages, setPages] = useState<DashboardEditablePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard/pages")
      .then(async (response) => {
        const result = (await response.json()) as { pages?: DashboardEditablePage[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Website pages could not be loaded.");
        if (active) setPages(result.pages ?? []);
      })
      .catch((error) => {
        if (active) onNotice(error instanceof Error ? error.message : "Website pages could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [onNotice]);

  async function savePage(
    page: DashboardEditablePage,
    content: DashboardEditablePage["content"],
    photo?: File | null,
    feeDocument?: File | null,
  ) {
    let uploadedImagePath = "";
    let uploadedDocumentPath = "";
    setSavingKey(page.key);
    try {
      if (photo?.size) uploadedImagePath = await uploadPageImage(photo, page.key);
      if (feeDocument?.size) uploadedDocumentPath = await uploadFeeDocument(feeDocument);
      const response = await fetch("/api/dashboard/pages", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          key: page.key,
          content,
          photoObjectPath: uploadedImagePath || null,
          documentObjectPath: uploadedDocumentPath || null,
        }),
      });
      const text = await response.text();
      const result = text
        ? (JSON.parse(text) as { page?: DashboardEditablePage; error?: string })
        : {};
      if (!response.ok || !result.page) {
        throw new Error(result.error || "The page could not be saved.");
      }
      setPages((items) =>
        items.map((item) => (item.key === result.page?.key ? result.page : item)),
      );
      onNotice(`${page.label} has been updated on the website.`);
    } catch (error) {
      if (uploadedImagePath) {
        await createSupabaseBrowserClient().storage.from("site-images").remove([uploadedImagePath]);
      }
      if (uploadedDocumentPath) {
        await createSupabaseBrowserClient().storage.from("site-documents").remove([uploadedDocumentPath]);
      }
      onNotice(error instanceof Error ? error.message : "The page could not be saved.");
    } finally {
      setSavingKey("");
    }
  }

  if (loading) {
    return <div className="border border-school-navy/10 bg-white p-10 text-center text-sm text-school-muted">Loading editable pages…</div>;
  }

  return (
    <div>
      <p className="text-[0.66rem] font-bold uppercase tracking-[0.17em] text-school-red">Website content</p>
      <h2 className="mt-3 font-serif text-4xl tracking-[-0.035em] sm:text-5xl">Core pages</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-school-muted">
        Update leadership messages, enrichment programmes and published fee information without changing code.
      </p>

      {pages.length ? (
        <div className="mt-8 grid gap-8">
          {pages.map((page) =>
            page.kind === "leadership-message" ? (
              <LeadershipMessageEditor
                key={`${page.key}-${page.updatedAt}`}
                page={page}
                saving={savingKey === page.key}
                onSave={savePage}
              />
            ) : page.kind === "fee-structure" ? (
              <FeeStructureEditor
                key={`${page.key}-${page.updatedAt}`}
                page={page}
                saving={savingKey === page.key}
                onSave={savePage}
              />
            ) : (
              <EnrichmentEditor
                key={`${page.key}-${page.updatedAt}`}
                page={page}
                saving={savingKey === page.key}
                onSave={savePage}
              />
            ),
          )}
        </div>
      ) : (
        <div className="mt-8 border border-school-navy/10 bg-white p-10 text-center">
          <FileText aria-hidden="true" className="mx-auto size-8 text-school-red" />
          <p className="mt-4 text-sm text-school-muted">Run supabase/content-management.sql, then reopen Pages.</p>
        </div>
      )}
    </div>
  );
}

function EnrichmentEditor({
  page,
  saving,
  onSave,
}: {
  page: DashboardEnrichmentPage;
  saving: boolean;
  onSave: (
    page: DashboardEditablePage,
    content: DashboardEditablePage["content"],
  ) => void;
}) {
  const content = page.content;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    onSave(page, {
      ...content,
      hero: {
        eyebrow: field(values, "heroEyebrow"),
        title: field(values, "heroTitle"),
        accent: field(values, "heroAccent"),
        description: field(values, "heroDescription"),
      },
      introduction: {
        eyebrow: field(values, "introEyebrow"),
        title: field(values, "introTitle"),
        accent: field(values, "introAccent"),
        paragraphs: paragraphs(field(values, "introParagraphs")),
      },
      programmeAreas: content.programmeAreas.map((area, index) => ({
        label: field(values, `programmeLabel${index}`),
        title: field(values, `programmeTitle${index}`),
        description: field(values, `programmeDescription${index}`),
      })),
      schoolSections: content.schoolSections.map((section, index) => ({
        label: field(values, `schoolLabel${index}`),
        stage: field(values, `schoolStage${index}`),
        title: field(values, `schoolTitle${index}`),
        description: field(values, `schoolDescription${index}`),
        points: lines(field(values, `schoolPoints${index}`)),
      })),
      statement: field(values, "statement"),
      person: content.person,
      role: content.role,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="border-t-4 border-school-red bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-school-red">
            Sports & co-curricular programme
          </p>
          <h3 className="mt-2 font-serif text-3xl">
            Sports, swimming & co-curricular
          </h3>
        </div>
        <p className="max-w-md border-l-2 border-school-gold pl-4 text-xs leading-6 text-school-muted">
          Replace this page&apos;s six activity photographs from Media → Sports & Co. The Sports Head&apos;s name, role and portrait are managed under Leadership.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <Field label="Hero label">
          <input name="heroEyebrow" defaultValue={content.hero.eyebrow} required className={inputClass} />
        </Field>
        <Field label="Hero headline">
          <input name="heroTitle" defaultValue={content.hero.title} required className={inputClass} />
        </Field>
        <Field label="Highlighted words">
          <input name="heroAccent" defaultValue={content.hero.accent} className={inputClass} />
        </Field>
        <Field label="Hero description">
          <textarea name="heroDescription" defaultValue={content.hero.description} required className={`${inputClass} min-h-24 resize-y`} />
        </Field>
      </div>

      <div className="mt-7 grid gap-4 border border-school-navy/10 bg-school-cream/45 p-5 md:grid-cols-2">
        <Field label="Introduction label">
          <input name="introEyebrow" defaultValue={content.introduction.eyebrow} required className={inputClass} />
        </Field>
        <Field label="Introduction heading">
          <input name="introTitle" defaultValue={content.introduction.title} required className={inputClass} />
        </Field>
        <Field label="Introduction highlighted words">
          <input name="introAccent" defaultValue={content.introduction.accent} className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Introduction paragraphs (leave a blank line between them)">
            <textarea name="introParagraphs" defaultValue={content.introduction.paragraphs.join("\n\n")} required className={`${inputClass} min-h-64 resize-y`} />
          </Field>
        </div>
      </div>

      <div className="mt-7">
        <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-school-red">
          Programme areas
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {content.programmeAreas.map((area, index) => (
            <section key={index} className="grid gap-4 border border-school-navy/10 p-5">
              <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
                <Field label="Number">
                  <input name={`programmeLabel${index}`} defaultValue={area.label} required className={inputClass} />
                </Field>
                <Field label="Title">
                  <input name={`programmeTitle${index}`} defaultValue={area.title} required className={inputClass} />
                </Field>
              </div>
              <Field label="Description">
                <textarea name={`programmeDescription${index}`} defaultValue={area.description} required className={`${inputClass} min-h-24 resize-y`} />
              </Field>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <p className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-school-red">
          School sections
        </p>
        <div className="mt-4 grid gap-5">
          {content.schoolSections.map((section, index) => (
            <section key={index} className="grid gap-4 border border-school-navy/10 bg-school-cream/45 p-5 md:grid-cols-2">
              <Field label="School section">
                <input name={`schoolLabel${index}`} defaultValue={section.label} required className={inputClass} />
              </Field>
              <Field label="Classes / years">
                <input name={`schoolStage${index}`} defaultValue={section.stage} required className={inputClass} />
              </Field>
              <Field label="Section headline">
                <input name={`schoolTitle${index}`} defaultValue={section.title} required className={inputClass} />
              </Field>
              <Field label="Programme labels (one per line)">
                <textarea name={`schoolPoints${index}`} defaultValue={section.points.join("\n")} required className={`${inputClass} min-h-24 resize-y`} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Section introduction">
                  <textarea name={`schoolDescription${index}`} defaultValue={section.description} required className={`${inputClass} min-h-28 resize-y`} />
                </Field>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-4 border-l-4 border-school-gold bg-school-navy p-5 text-white md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Closing statement">
            <textarea name="statement" defaultValue={content.statement} required className={`${inputClass} min-h-24 resize-y`} />
          </Field>
        </div>
        <p className="text-sm leading-7 text-white/70 md:col-span-2">
          The department head shown beside the opening message is the Head
          Co-curricular profile under Leadership. Edit that profile to change
          the person, role or portrait.
        </p>
      </div>

      <div className="mt-7 flex justify-end">
        <SaveButton saving={saving} label="Save Sports & Co. page" />
      </div>
    </form>
  );
}

function LeadershipMessageEditor({
  page,
  saving,
  onSave,
}: {
  page: DashboardLeadershipMessagePage;
  saving: boolean;
  onSave: (page: DashboardEditablePage, content: DashboardEditablePage["content"], photo?: File | null) => void;
}) {
  const message = page.content;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const sections = message.sections.map((section, index) => ({
      heading: field(values, `sectionHeading${index}`),
      paragraphs: paragraphs(field(values, `sectionParagraphs${index}`)),
    }));
    const photo = values.get("photo");
    onSave(
      page,
      {
        ...message,
        eyebrow: field(values, "eyebrow"),
        title: field(values, "title"),
        accent: field(values, "accent"),
        description: field(values, "description"),
        person: field(values, "person"),
        role: field(values, "role"),
        imageAlt: field(values, "imageAlt"),
        sections,
      },
      photo instanceof File ? photo : null,
    );
  }

  return (
    <form onSubmit={submit} className="overflow-hidden border border-school-navy/10 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="bg-school-navy p-6 text-white">
          <div className="relative aspect-square overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={normalizePublicImageUrl(message.image)} alt="" className="h-full w-full object-contain" />
          </div>
          <label className="mt-5 grid gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-school-gold">
            Replace portrait
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/avif" className="text-xs font-normal normal-case tracking-normal text-white/70 file:mr-3 file:border-0 file:bg-white file:px-3 file:py-2 file:text-[0.6rem] file:font-bold file:uppercase file:text-school-navy" />
          </label>
        </div>
        <div className="grid gap-4 p-6 sm:p-7">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-school-red">Leadership message</p>
            <h3 className="mt-2 font-serif text-3xl">{page.label}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Person"><input name="person" defaultValue={message.person} required className={inputClass} /></Field>
            <Field label="Role"><input name="role" defaultValue={message.role} required className={inputClass} /></Field>
            <Field label="Page label"><input name="eyebrow" defaultValue={message.eyebrow} required className={inputClass} /></Field>
            <Field label="Headline"><input name="title" defaultValue={message.title} required className={inputClass} /></Field>
            <Field label="Highlighted words"><input name="accent" defaultValue={message.accent} className={inputClass} /></Field>
            <Field label="Portrait description"><input name="imageAlt" defaultValue={message.imageAlt} required className={inputClass} /></Field>
          </div>
          <Field label="Page introduction"><textarea name="description" defaultValue={message.description} required className={`${inputClass} min-h-24 resize-y`} /></Field>
        </div>
      </div>
      <div className="grid gap-5 border-t border-school-navy/10 p-6 sm:p-7">
        {message.sections.map((section, index) => (
          <div key={index} className="grid gap-4 border border-school-navy/10 bg-school-cream/45 p-5 md:grid-cols-[240px_minmax(0,1fr)]">
            <Field label={`Section ${index + 1} heading`}>
              <input name={`sectionHeading${index}`} defaultValue={section.heading ?? ""} className={inputClass} />
            </Field>
            <Field label="Paragraphs (leave a blank line between them)">
              <textarea name={`sectionParagraphs${index}`} defaultValue={section.paragraphs.join("\n\n")} required className={`${inputClass} min-h-32 resize-y`} />
            </Field>
          </div>
        ))}
        <div className="flex justify-end">
          <SaveButton saving={saving} label="Save message" />
        </div>
      </div>
    </form>
  );
}

function FeeStructureEditor({
  page,
  saving,
  onSave,
}: {
  page: DashboardFeePage;
  saving: boolean;
  onSave: (
    page: DashboardEditablePage,
    content: DashboardEditablePage["content"],
    photo?: File | null,
    feeDocument?: File | null,
  ) => void;
}) {
  const content = page.content;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const feeDocument = values.get("feeDocument");
    onSave(
      page,
      {
        ...content,
        hero: {
          ...content.hero,
          title: field(values, "heroTitle"),
          accent: field(values, "heroAccent"),
          description: field(values, "heroDescription"),
        },
        introduction: {
          ...content.introduction,
          title: field(values, "introTitle"),
          accent: field(values, "introAccent"),
          paragraphs: paragraphs(field(values, "introParagraphs")),
        },
        highlights: content.highlights.map((highlight, index) => ({
          label: field(values, `highlightLabel${index}`),
          value: field(values, `highlightValue${index}`),
          note: field(values, `highlightNote${index}`),
        })),
        sections: content.sections.map((section, index) => ({
          eyebrow: field(values, `feeEyebrow${index}`),
          title: field(values, `feeTitle${index}`),
          paragraphs: paragraphs(field(values, `feeParagraphs${index}`)),
          points: lines(field(values, `feePoints${index}`)),
        })),
        document: content.document
          ? {
              ...content.document,
              label: field(values, "documentLabel"),
              fileName: field(values, "documentFileName"),
              description: field(values, "documentDescription"),
            }
          : undefined,
        notice: content.notice
          ? {
              ...content.notice,
              title: field(values, "noticeTitle"),
              description: field(values, "noticeDescription"),
            }
          : undefined,
      },
      null,
      feeDocument instanceof File ? feeDocument : null,
    );
  }

  return (
    <form onSubmit={submit} className="border-t-4 border-school-gold bg-white p-6 shadow-sm sm:p-8">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-school-red">Admissions information</p>
      <h3 className="mt-2 font-serif text-3xl">Fee structure</h3>

      {content.document ? (
        <div className="mt-6 grid gap-5 border-l-4 border-school-gold bg-school-cream/60 p-5 text-school-ink md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-school-red">
                  Downloadable fee document
                </p>
                <p className="mt-2 text-sm text-school-muted">
                  Upload a new PDF whenever the official schedule changes.
                </p>
              </div>
              <a
                href={content.document.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-school-navy hover:text-school-red"
              >
                <FileDown aria-hidden="true" className="size-4" />
                View current PDF
              </a>
            </div>
          </div>
          <Field label="Replace PDF">
            <input
              type="file"
              name="feeDocument"
              accept="application/pdf,.pdf"
              className="text-xs font-normal normal-case tracking-normal text-school-muted file:mr-3 file:border-0 file:bg-school-navy file:px-3 file:py-2 file:text-[0.6rem] file:font-bold file:uppercase file:text-white"
            />
          </Field>
          <Field label="Downloaded file name">
            <input
              name="documentFileName"
              defaultValue={content.document.fileName}
              required
              pattern="[A-Za-z0-9][A-Za-z0-9._-]*[.]pdf"
              className={inputClass}
            />
          </Field>
          <Field label="Download section heading">
            <input name="documentLabel" defaultValue={content.document.label} required className={inputClass} />
          </Field>
          <Field label="Document description">
            <textarea name="documentDescription" defaultValue={content.document.description} required className={`${inputClass} min-h-24 resize-y`} />
          </Field>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Hero headline"><input name="heroTitle" defaultValue={content.hero.title} required className={inputClass} /></Field>
        <Field label="Highlighted words"><input name="heroAccent" defaultValue={content.hero.accent} className={inputClass} /></Field>
        <div className="md:col-span-2"><Field label="Hero description"><textarea name="heroDescription" defaultValue={content.hero.description} required className={`${inputClass} min-h-24 resize-y`} /></Field></div>
        <Field label="Introduction title"><input name="introTitle" defaultValue={content.introduction.title} required className={inputClass} /></Field>
        <Field label="Introduction accent"><input name="introAccent" defaultValue={content.introduction.accent} className={inputClass} /></Field>
        <div className="md:col-span-2"><Field label="Introduction paragraphs"><textarea name="introParagraphs" defaultValue={content.introduction.paragraphs.join("\n\n")} required className={`${inputClass} min-h-32 resize-y`} /></Field></div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {content.highlights.map((highlight, index) => (
          <section key={index} className="grid gap-4 border border-school-navy/10 bg-school-cream/45 p-5">
            <Field label="Fee label"><input name={`highlightLabel${index}`} defaultValue={highlight.label} required className={inputClass} /></Field>
            <Field label="Amount / value"><input name={`highlightValue${index}`} defaultValue={highlight.value} required className={inputClass} /></Field>
            <Field label="Note"><input name={`highlightNote${index}`} defaultValue={highlight.note} className={inputClass} /></Field>
          </section>
        ))}
      </div>

      <div className="mt-7 grid gap-5">
        {content.sections.map((section, index) => (
          <section key={index} className="grid gap-4 border border-school-navy/10 p-5 md:grid-cols-2">
            <Field label="Section label"><input name={`feeEyebrow${index}`} defaultValue={section.eyebrow} className={inputClass} /></Field>
            <Field label="Section title"><input name={`feeTitle${index}`} defaultValue={section.title} required className={inputClass} /></Field>
            <Field label="Explanation"><textarea name={`feeParagraphs${index}`} defaultValue={section.paragraphs.join("\n\n")} required className={`${inputClass} min-h-28 resize-y`} /></Field>
            <Field label="Charges (one per line)"><textarea name={`feePoints${index}`} defaultValue={section.points?.join("\n")} className={`${inputClass} min-h-28 resize-y`} /></Field>
          </section>
        ))}
      </div>

      {content.notice ? (
        <div className="mt-7 grid gap-4 border-l-4 border-school-gold bg-school-navy p-5 text-white md:grid-cols-2">
          <Field label="Important notice title"><input name="noticeTitle" defaultValue={content.notice.title} required className={inputClass} /></Field>
          <Field label="Important notice"><textarea name="noticeDescription" defaultValue={content.notice.description} required className={`${inputClass} min-h-28 resize-y`} /></Field>
        </div>
      ) : null}
      <div className="mt-7 flex justify-end"><SaveButton saving={saving} label="Save fee structure" /></div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-[0.62rem] font-bold uppercase tracking-[0.11em] text-school-muted">{label}{children}</label>;
}

function SaveButton({ saving, label }: { saving: boolean; label: string }) {
  return (
    <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-3 bg-school-red px-6 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white hover:bg-school-red-dark disabled:cursor-wait disabled:opacity-60">
      {saving ? <Upload aria-hidden="true" className="size-4 animate-pulse" /> : <Save aria-hidden="true" className="size-4" />}
      {saving ? "Saving…" : label}
    </button>
  );
}

async function uploadPageImage(file: File, stem: string) {
  const uploadFile = await prepareDashboardImage(file);
  const extension = getDashboardImageExtension(uploadFile);
  const objectPath = `pages/${stem}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await createSupabaseBrowserClient().storage.from("site-images").upload(objectPath, uploadFile, {
    contentType: uploadFile.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message || "The portrait upload failed.");
  return objectPath;
}

async function uploadFeeDocument(file: File) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Choose a PDF fee structure document.");
  }
  const objectPath = `documents/fee-structure-${Date.now()}-${crypto.randomUUID()}.pdf`;
  const { error } = await createSupabaseBrowserClient().storage
    .from("site-documents")
    .upload(objectPath, file, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });
  if (error) throw new Error(error.message || "The fee document upload failed.");
  return objectPath;
}

function field(values: FormData, name: string) {
  return String(values.get(name) ?? "").trim();
}

function paragraphs(value: string) {
  return value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
}

function lines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}
