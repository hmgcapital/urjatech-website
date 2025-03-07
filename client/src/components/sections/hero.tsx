import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useEffect, useState } from "react";

export default function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = "/factory.webp";
    img.onload = () => setImageLoaded(true);
    img.onerror = (e) => console.error("Failed to load image:", e);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center -mt-16"
      style={{
        backgroundImage: `url('/factory.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Image loading fallback */}
      {!imageLoaded && <div className="absolute inset-0 bg-gray-800 -z-10" />}

      {/* No gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-0" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <ScrollReveal
          animation={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
          }}
          threshold={0.1}
        >
          <div className="max-w-3xl pt-16">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-['Figtree']">
              Electrifying the world, one step at a time.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Leading manufacturer of Conductors, Power and A.B. cables for
              transmission and distribution networks worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-black border-2 border-white text-white uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none"
                >
                  Explore Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-black border-2 border-white text-white uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
