import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const routes = [
    "",
    "/news",
    "/ai",
    "/mobile",
    "/laptops",
    "/gaming",
    "/cybersecurity",
    "/cloud",
    "/reviews",
    "/buying-guides",
    "/deals",
    "/videos",
    "/podcasts",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "always" : "daily",
    priority: route === "" ? 1.0 : route.startsWith("/reviews") ? 0.9 : 0.8,
  }));
}
