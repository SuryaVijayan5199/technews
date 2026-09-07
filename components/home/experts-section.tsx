import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ExternalLink } from "lucide-react";

const EXPERTS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "AI & Machine Learning",
    bio: "Former DeepMind researcher analyzing the real-world implications of generative AI and neural networks.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    slug: "sarah-chen",
  },
  {
    id: 2,
    name: "Marcus Reynolds",
    role: "Consumer Hardware",
    bio: "Over 15 years reviewing flagship smartphones, laptops, and the latest consumer electronics.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    slug: "marcus-reynolds",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Cybersecurity Editor",
    bio: "Investigative journalist uncovering data breaches and tracking global cyber warfare tactics.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    slug: "elena-rodriguez",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Silicon & Processors",
    bio: "Semiconductor analyst breaking down complex chip architectures and foundries into accessible insights.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
    slug: "david-kim",
  },
];

interface ExpertsSectionProps {
  authors?: any[];
}

export function ExpertsSection({ authors }: ExpertsSectionProps) {
  const displayList =
    authors && authors.length > 0
      ? authors.map((a) => ({
          id: a.id,
          name: a.displayName,
          role: a.user?.role ? a.user.role.replace(/_/g, " ").toUpperCase() : "TECHCREST AUTHOR",
          bio: a.bio || `Official TechCrest editorial contributor.`,
          avatar: a.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(a.displayName)}`,
          slug: a.slug,
        }))
      : EXPERTS;

  return (
    <section className="experts-section">
      <div className="container">
        <div className="experts-section__header">
          <div>
            <h2 className="experts-section__title">
              Meet Our Editorial Team
            </h2>
            <p className="experts-section__subtitle">
              Independent journalism backed by dedicated tech writers and specialized editors.
            </p>
          </div>
        </div>

        <div className="experts-section__grid">
          {displayList.map((expert) => (
            <article key={expert.id} className="expert-card">
              <div className="expert-card__avatar-wrap">
                <div className="expert-card__avatar-inner">
                  <Image
                    src={expert.avatar}
                    alt={expert.name}
                    width={96}
                    height={96}
                    className="expert-card__image"
                  />
                </div>
                <div className="expert-card__badge">
                  <BadgeCheck className="expert-card__badge-icon" fill="currentColor" />
                </div>
              </div>
              
              <h3 className="expert-card__name">
                <Link 
                  href={`/authors/${expert.slug}`}
                  className="expert-card__link"
                >
                  {expert.name}
                </Link>
              </h3>
              <p className="expert-card__role">
                {expert.role}
              </p>
              
              <p className="expert-card__bio">
                {expert.bio}
              </p>
              
              <div className="expert-card__footer">
                <Link href={`/authors/${expert.slug}`} className="expert-card__action">
                  View Profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
