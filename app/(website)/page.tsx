import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { TechCrestHomepage } from "@/components/home/techcrest-homepage";

// ISR: revalidate homepage every 60 seconds for fresh news delivery
// Instant purge on publish or scheduled release via invalidateArticleCache() -> revalidatePath("/")
export const revalidate = 60;

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <TechCrestHomepage />;
}

