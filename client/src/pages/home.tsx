import Hero from "@/components/sections/hero";
import Manufacturing from "@/components/sections/manufacturing";
import FeaturedProducts from "@/components/sections/featured-products";
import Certifications from "@/components/sections/certifications";
import Customers from "@/components/sections/customers";

export default function Home() {
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