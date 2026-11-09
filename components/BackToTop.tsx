"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 560);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function returnToNavigation() {
    const navigation = document.getElementById("site-navigation");
    if (navigation) {
      navigation.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={returnToNavigation}
      aria-label="Back to the main navigation"
      title="Back to navigation"
      className={`fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center border border-white/25 bg-school-navy text-white shadow-[0_12px_30px_rgba(6,47,95,0.28)] transition-[opacity,transform,background-color] duration-300 hover:bg-school-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-school-red sm:bottom-7 sm:right-7 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={1.8} />
    </button>
  );
}
