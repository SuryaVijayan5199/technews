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
    <div className="container tc-page-section tc-page-narrow">
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 tc-breadcrumb">
          <Link href="/" className="tc-breadcrumb__link">Home</Link>
          <ChevronRight className="tc-icon-xs" />
          <span className="tc-text-muted">Podcasts</span>
        </nav>
        <div className="flex items-center gap-3 mb-2">
          <div className="tc-page-icon">
            <Mic className="tc-icon-md" />
          </div>
          <div>
            <h1 className="tc-page-title" style={{ fontFamily: "var(--font-outfit)" }}>
              The TechCrest Podcast
            </h1>
            <p className="tc-text-meta">New episodes every Tuesday</p>
          </div>
        </div>
      </div>

      <div className="tc-list-spaced-sm">
        {EPISODES.map((ep) => (
          <div key={ep.id} className="card p-6 flex justify-between gap-4 tc-podcast-card">
            <div className="tc-podcast-card__body">
              <div className="flex items-center gap-3">
                <span className="tc-podcast-card__cat">{ep.episode}</span>
                <span className="tc-text-meta">{ep.date} · {ep.duration}</span>
              </div>
              <h2 className="tc-podcast-card__title" style={{ fontFamily: "var(--font-outfit)" }}>
                {ep.title}
              </h2>
              <p className="tc-podcast-card__desc">{ep.summary}</p>
            </div>
            <button className="btn btn-primary flex-shrink-0 text-xs py-2 px-4">
              <Play className="tc-icon-play" /> Listen Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
