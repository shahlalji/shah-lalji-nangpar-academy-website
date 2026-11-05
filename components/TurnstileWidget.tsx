"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cloudflare-turnstile-script";
let scriptPromise: Promise<void> | null = null;

export function TurnstileWidget({
  siteKey,
  action,
  resetKey,
  onToken,
}: {
  siteKey: string;
  action: "enquiry" | "story-comment";
  resetKey: number;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let active = true;
    let widgetId = "";
    onToken("");
    setLoadError(false);

    void loadTurnstile()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "light",
          size: "flexible",
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => {
            onToken("");
            setLoadError(true);
          },
        });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [action, onToken, resetKey, siteKey]);

  if (!siteKey) return null;

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="min-h-[65px] w-full" />
      <p className="text-xs leading-5 text-school-muted" aria-live="polite">
        {loadError
          ? "The security check could not load. Check your connection and try again."
          : "Complete the security check before submitting."}
      </p>
    </div>
  );
}

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");

    const onLoad = () => {
      if (window.turnstile) resolve();
      else reject(new Error("Turnstile did not initialise."));
    };
    const onError = () => reject(new Error("Turnstile could not be loaded."));

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });

    if (!existing) {
      script.id = SCRIPT_ID;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}
