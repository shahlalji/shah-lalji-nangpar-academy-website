import { getSiteOrigin } from "@/lib/site-origin";

type EnquiryNotification = {
  parentName: string;
  email: string;
  phone: string;
  childAge: string;
  yearGroup: string;
  message: string;
};

export async function notifyNewEnquiry(input: EnquiryNotification) {
  const rows = [
    ["Parent or guardian", input.parentName],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Child's age", input.childAge],
    ["Year group", input.yearGroup],
    ["Message", input.message],
  ] as const;

  return sendAdminEmail({
    subject: `New admissions enquiry from ${input.parentName}`,
    heading: "A new admissions enquiry has arrived",
    rows,
    actionLabel: "Open the school dashboard",
    actionUrl: `${getSiteOrigin()}/dashboard`,
    replyTo: input.email,
  });
}

export async function notifyPendingStoryComment(input: {
  storySlug: string;
  name: string;
  body: string;
}) {
  const origin = getSiteOrigin();
  return sendAdminEmail({
    subject: `Story comment awaiting review from ${input.name}`,
    heading: "A new story comment is awaiting moderation",
    rows: [
      ["Story", input.storySlug],
      ["Name", input.name],
      ["Comment", input.body],
    ],
    actionLabel: "Review comments in the dashboard",
    actionUrl: `${origin}/dashboard`,
    secondaryUrl: `${origin}/stories/${encodeURIComponent(input.storySlug)}`,
  });
}

async function sendAdminEmail(input: {
  subject: string;
  heading: string;
  rows: readonly (readonly [string, string])[];
  actionLabel: string;
  actionUrl: string;
  secondaryUrl?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const recipients = (process.env.ADMIN_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!apiKey || !from || recipients.length === 0) return false;

  const htmlRows = input.rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 14px;font-weight:700;vertical-align:top;border-bottom:1px solid #e4e8ee">${escapeHtml(label)}</td><td style="padding:10px 14px;white-space:pre-wrap;border-bottom:1px solid #e4e8ee">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const textRows = input.rows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: input.subject,
        html: `<div style="font-family:Arial,sans-serif;color:#102238;line-height:1.6"><h1 style="font-family:Georgia,serif;color:#073b70">${escapeHtml(input.heading)}</h1><table style="width:100%;max-width:680px;border-collapse:collapse;border:1px solid #e4e8ee">${htmlRows}</table><p style="margin-top:24px"><a href="${escapeAttribute(input.actionUrl)}" style="display:inline-block;background:#c91f2a;color:#fff;padding:12px 18px;text-decoration:none;font-weight:700">${escapeHtml(input.actionLabel)}</a></p>${input.secondaryUrl ? `<p><a href="${escapeAttribute(input.secondaryUrl)}">View the public story</a></p>` : ""}</div>`,
        text: `${input.heading}\n\n${textRows}\n\n${input.actionLabel}: ${input.actionUrl}${input.secondaryUrl ? `\nPublic story: ${input.secondaryUrl}` : ""}`,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}
