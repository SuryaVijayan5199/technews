import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { TechCrestHomePage } from "@/components/home/techcrest-homepage";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return <TechCrestHomePage />;
}
