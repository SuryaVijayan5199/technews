import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { TechCrestHomepage } from "@/components/home/techcrest-homepage";

// ISR: revalidate once every 24 hours (86400s).
// Instant purge on publish or edit via invalidateArticleCache() -> revalidatePath.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <TechCrestHomepage />;
}

