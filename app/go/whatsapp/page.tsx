// app/go/whatsapp/page.tsx
//
// Place this file at app/go/whatsapp/page.tsx in your Next.js project.
//
// Why this exists: Brevo (our transactional email provider) rewrites every
// link in the order emails into its own click-tracking redirect before it
// reaches the real destination — there's no way to disable that for
// transactional sends. Sending people straight from there to wa.me meant
// that if the hand-off to WhatsApp was slow or failed, they just saw a
// blank/broken page with nothing to do about it.
//
// This page is the actual final hop instead: it attempts to open WhatsApp
// the instant it loads, and — if that doesn't fire within ~1.5s (WhatsApp
// not installed, browser blocked it, flaky connection, etc.) — it reveals a
// plain "Tap to Open WhatsApp" button so the click is always recoverable
// instead of silently dying.
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function WhatsAppRedirectInner() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "";
  const text = searchParams.get("text") || "";
  const [waiting, setWaiting] = useState(true);

  const waLink = to ? `https://wa.me/${to}${text ? `?text=${encodeURIComponent(text)}` : ""}` : "";

  useEffect(() => {
    if (!waLink) return;
    // Fire immediately — Brevo's own tracking hop has already completed by
    // the time this page loads, so this is the only redirect left and it's
    // fully under our control (fast, on our own domain, no dependency on a
    // third party's tracking infra staying up).
    window.location.href = waLink;

    // If the browser/OS actually hands off to WhatsApp, this tab/page is
    // gone before this fires. If nothing happens, reveal the manual
    // fallback button instead of leaving a blank screen.
    const timer = setTimeout(() => setWaiting(false), 1500);
    return () => clearTimeout(timer);
  }, [waLink]);

  if (!to) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: 24,
          textAlign: "center",
          color: "#475569",
        }}
      >
        <p>Missing WhatsApp destination.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: 24,
        textAlign: "center",
        gap: 16,
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}
      >
        💬
      </div>
      <p style={{ color: "#475569", fontSize: 14, margin: 0, fontWeight: 600 }}>
        {waiting ? "Opening WhatsApp…" : "Didn't open automatically?"}
      </p>
      <a
        href={waLink}
        style={{
          display: "inline-block",
          background: "#25D366",
          color: "#fff",
          fontWeight: 800,
          fontSize: 14,
          textDecoration: "none",
          padding: "13px 28px",
          borderRadius: 10,
        }}
      >
        Tap to Open WhatsApp
      </a>
    </main>
  );
}

export default function WhatsAppRedirectPage() {
  return (
    <Suspense fallback={null}>
      <WhatsAppRedirectInner />
    </Suspense>
  );
}