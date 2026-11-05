type TurnstileResult = {
  success?: boolean;
  action?: string;
};

export async function verifyTurnstile(
  request: Request,
  tokenValue: unknown,
  expectedAction: "enquiry" | "story-comment",
) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true, configured: false } as const;

  const token = typeof tokenValue === "string" ? tokenValue.trim() : "";
  if (!token || token.length > 2048) {
    return { ok: false, configured: true } as const;
  }

  const remoteIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    undefined;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip: remoteIp,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!response.ok) return { ok: false, configured: true } as const;

    const result = (await response.json()) as TurnstileResult;
    return {
      ok: result.success === true && result.action === expectedAction,
      configured: true,
    } as const;
  } catch {
    return { ok: false, configured: true } as const;
  }
}
