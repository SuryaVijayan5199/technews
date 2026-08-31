export const siteConfig = {
  name: "TechCrest",
  tagline: "The Future of Technology Journalism",
  description:
    "TechCrest covers the latest technology news, in-depth reviews, buying guides, and analysis from industry experts. Your trusted source for AI, mobile, laptops, gaming, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://technews-lyart.vercel.app",
  ogImage: "/logos/icons/techcrest-app-icon-gradient-512.png",
  twitterHandle: "@techcrest",
  authors: [{ name: "TechCrest Editorial Team" }],
  keywords: [
    "TechCrest",
    "technology news",
    "tech reviews",
    "AI news",
    "smartphone reviews",
    "laptop reviews",
    "gaming",
    "cybersecurity",
    "cloud computing",
  ] as string[],
  socialLinks: {
    twitter: "https://twitter.com/techcrest",
    youtube: "https://youtube.com/@techcrest",
    facebook: "https://facebook.com/techcrest",
    instagram: "https://instagram.com/techcrest",
    linkedin: "https://linkedin.com/company/techcrest",
    rss: "/feed.xml",
  },
};

export type SiteConfig = typeof siteConfig;
