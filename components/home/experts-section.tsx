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

export function ExpertsSection() {
  return (
    <section className="experts-section">
      <div className="container">
        <div className="experts-section__header">
          <div>
            <h2 className="experts-section__title">
              Meet Our Experts
            </h2>
            <p className="experts-section__subtitle">
              Independent journalism backed by industry veterans. Our specialized editors bring decades of hands-on experience to every review.
            </p>
          </div>
          <Link href="/authors" className="btn btn-ghost experts-section__link">
            View All Experts <ExternalLink className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="experts-section__grid">
          {EXPERTS.map((expert) => (
            <article 
              key={expert.id}
              className="expert-card group"
            >
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
                  href={`/author/${expert.slug}`}
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
                <span className="expert-card__action">
                  View Profile
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
