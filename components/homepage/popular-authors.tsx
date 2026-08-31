import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const AUTHORS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    slug: "sarah-chen",
    role: "AI & Machine Learning",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&q=80",
    articleCount: 342,
    isVerified: true,
  },
  {
    id: 2,
    name: "James Park",
    slug: "james-park",
    role: "Mobile & Wearables",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80",
    articleCount: 218,
    isVerified: true,
  },
  {
    id: 3,
    name: "Alex Thompson",
    slug: "alex-thompson",
    role: "Laptops & Productivity",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80",
    articleCount: 189,
    isVerified: true,
  },
  {
    id: 4,
    name: "Priya Sharma",
    slug: "priya-sharma",
    role: "Cybersecurity",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&q=80",
    articleCount: 156,
    isVerified: false,
  },
  {
    id: 5,
    name: "Carlos Mendez",
    slug: "carlos-mendez",
    role: "Gaming",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&q=80",
    articleCount: 134,
    isVerified: true,
  },
  {
    id: 6,
    name: "Emily Zhang",
    slug: "emily-zhang",
    role: "Consumer Tech",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&q=80",
    articleCount: 98,
    isVerified: false,
  },
];

export function PopularAuthors() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {AUTHORS.map((author) => (
        <Link
          key={author.id}
          href={`/authors/${author.slug}`}
          className="group card p-4 text-center block"
        >
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="rounded-full object-cover group-hover:ring-2 ring-[var(--color-brand-500)] transition-all"
            />
            {author.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-[var(--color-brand-400)] bg-[var(--color-surface-0)] rounded-full" />
            )}
          </div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5 group-hover:text-[var(--color-brand-300)] transition-colors">
            {author.name}
          </h3>
          <p className="text-[10px] text-[var(--color-text-muted)] mb-1">
            {author.role}
          </p>
          <p className="text-[10px] text-[var(--color-brand-400)] font-medium">
            {author.articleCount} articles
          </p>
        </Link>
      ))}
    </div>
  );
}
