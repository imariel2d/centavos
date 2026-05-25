import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centavo",
    short_name: "Centavo",
    description: "Blog financiero mexicano sin choros.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf3e3",
    theme_color: "#faf3e3",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
    lang: "es-MX",
  };
}
