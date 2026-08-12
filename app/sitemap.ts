import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE.url}/`,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE.url}/app/soporte`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/app/privacidad`,      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE.url}/app/terminos`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE.url}/app/eliminar-cuenta`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
