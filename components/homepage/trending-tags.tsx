import Link from "next/link";

const TAGS = [
  { name: "GPT-5", slug: "gpt-5", count: 48 },
  { name: "iPhone 17", slug: "iphone-17", count: 42 },
  { name: "RTX 5090", slug: "rtx-5090", count: 38 },
  { name: "Pixel 10", slug: "pixel-10", count: 29 },
  { name: "EU AI Act", slug: "eu-ai-act", count: 24 },
  { name: "Kubernetes", slug: "kubernetes", count: 21 },
  { name: "Matter 2.0", slug: "matter-2", count: 18 },
  { name: "DLSS 5", slug: "dlss-5", count: 15 },
  { name: "Claude 4", slug: "claude-4", count: 14 },
  { name: "Steam Deck 2", slug: "steam-deck-2", count: 13 },
  { name: "Windows 12", slug: "windows-12", count: 11 },
  { name: "Starlink Gen4", slug: "starlink-gen4", count: 9 },
];

export function TrendingTags() {
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => (
        <Link
          key={tag.slug}
          href={`/tags/${tag.slug}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-surface-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-brand-500)] transition-all"
        >
          <span className="font-medium">{tag.name}</span>
          <span className="text-[10px] text-[var(--color-text-muted)]">
            {tag.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
