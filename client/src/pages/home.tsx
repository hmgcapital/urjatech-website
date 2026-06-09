import Hero from "@/components/sections/hero";
import Manufacturing from "@/components/sections/manufacturing";
import FeaturedProducts from "@/components/sections/featured-products";
import Certifications from "@/components/sections/certifications";
import Customers from "@/components/sections/customers";
import { useSEO } from "@/hooks/use-seo";

export default function Home() {
  useSEO({
    title: "Power Cables & Conductors Manufacturer India",
    description:
      "Urjatech manufactures high-quality ACSR, AAC, AAAC aluminum conductors and XLPE, ABC power cables for overhead transmission and distribution networks. Serving utilities across 15 states since 2011.",
    canonical: "/",
  });
  return (
    <div className="bg-white">
      <Hero />
      <FeaturedProducts />
      <Manufacturing />
      <Customers />
      <Certifications />
    </div>
  );
}