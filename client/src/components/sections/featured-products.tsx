import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const featuredProducts = [
  {
    name: "AL59 Conductors",
    description:
      "High electrical conductivity with excellent corrosion resistance for urban distribution networks.",
    image: "/products/AL59.webp",
    features: ["High conductivity", "Excellent corrosion resistance", "Lightweight with reduced sag"],
  },
  {
    name: "AAAC (All Aluminum Alloy Conductor)",
    description:
      "Superior strength-to-weight ratio and enhanced mechanical properties for medium-span transmission.",
    image: "/products/AAAC.webp",
    features: ["Superior strength", "Better sag", "Coastal area use"],
  },
  {
    name: "ACSR (Aluminum Conductor Steel Reinforced)",
    description:
      "Steel core for mechanical strength and aluminum outer layer for conductivity. Ideal for high-voltage transmission.",
    image: "/products/ACSR.webp",
    features: ["High tensile strength", "1200A rating", "Heavy loading"],
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 relative bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="section-heading text-gray-900">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our range of high-quality industrial electrical products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative aspect-square overflow-hidden group rounded-none border-2 border-gray-200">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                {/* Content */}
                <div className="relative h-full p-8 flex flex-col justify-end text-white z-20">
                  <div className="mb-1">
                    <h3 className="text-2xl font-black mb-3">{product.name}</h3>
                    <p className="text-white/80 text-base mb-4">{product.description}</p>
                    <ul className="space-y-1">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <span className="mr-2 text-primary">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="font-black border-2 border-gray-900 text-gray-900 uppercase bg-transparent hover:bg-gray-900 hover:text-white rounded-none mt-8"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}