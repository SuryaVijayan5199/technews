"use client";

import { useEffect, useRef } from "react";

export function ArticleViewTracker({ articleId }: { articleId: number }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!articleId || trackedRef.current) return;
    trackedRef.current = true;

    try {
      const payload = JSON.stringify({ id: articleId });
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/articles/view", blob);
      } else {
        fetch("/api/articles/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking telemetry
    }
  }, [articleId]);

  return null;
}
