import type { MetadataRoute } from "next";
import { business } from "@/lib/constants/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: "Sri Hari",
    description: `Gold, traditional and bridal jewellery in ${business.address.locality}, ${business.address.region}.`,
    start_url: "/",
    display: "browser",
    background_color: "#FAF8F3",
    theme_color: "#FAF8F3",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
