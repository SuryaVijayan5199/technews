"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  return (
    <div className="tc-share-btns">
      <span className="tc-share-btns__label">Share:</span>
      <button
        id="share-twitter"
        onClick={shareOnTwitter}
        className="tc-share-btns__btn"
        aria-label="Share on X / Twitter"
      >
        <svg className="tc-share-btns__icon fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        id="share-linkedin"
        onClick={shareOnLinkedIn}
        className="tc-share-btns__btn"
        aria-label="Share on LinkedIn"
      >
        <svg className="tc-share-btns__icon fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4z" />
        </svg>
      </button>
      <button
        id="share-copy-link"
        onClick={copyLink}
        className="tc-share-btns__btn"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="tc-share-btns__icon tc-share-btns__icon--copied" />
        ) : (
          <Link2 className="tc-share-btns__icon" />
        )}
      </button>
    </div>
  );
}
