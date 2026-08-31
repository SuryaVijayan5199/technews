import type { Metadata } from "next";
import Link from "next/link";
import { Mic, Play, Clock, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech Podcasts — The TechCrest Show",
  description: "Weekly conversations on the future of AI, tech policy, silicon design, and consumer electronics.",
};

const EPISODES = [
  {
    id: 1,
    episode: "Ep. 142",
    title: "Inside the AI War: OpenAI vs Google vs Anthropic",
    date: "July 28, 2026",
    duration: "54 mins",
    summary: "We sit down with leading AI researchers to discuss GPT-5, Gemini 2, and the safety benchmarks defining the next decade.",
  },
  {
    id: 2,
    episode: "Ep. 141",
    title: "Is Windows on Arm Finally Ready for Everyone?",
    date: "July 21, 2026",
    duration: "48 mins",
    summary: "Deep dive into Qualcomm's Snapdragon X4 performance, app translation layers, and battery benchmarks.",
  },
  {
    id: 3,
    episode: "Ep. 140",
    title: "The EU AI Act & The Future of Tech Regulation",
    date: "July 14, 2026",
    duration: "61 mins",
    summary: "Exploring how global tech regulation impacts startups, open-source AI models, and everyday consumers.",
  },
];

export default function PodcastsPage() {
  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
          <Link href="/" className="hover:text-[var(--color-text-secondary)]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-secondary)]">Podcasts</span>
        </nav>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-500)] text-white flex items-center justify-center">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
              The TechCrest Podcast
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">New episodes every Tuesday</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {EPISODES.map((ep) => (
          <div key={ep.id} className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-400)]">{ep.episode}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{ep.date} · {ep.duration}</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                {ep.title}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{ep.summary}</p>
            </div>
            <button className="btn btn-primary flex-shrink-0 text-xs py-2 px-4">
              <Play className="w-4 h-4 fill-current" /> Listen Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
