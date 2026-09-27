import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";

const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/collections", priority: 0.9, changeFrequency: "weekly" },
  { path: "/bridal", priority: 0.9, changeFrequency: "weekly" },
  { path: "/gold-jewellery", priority: 0.9, changeFrequency: "daily" },
  { path: "/wedding", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
