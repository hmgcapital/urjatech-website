import { motion } from "framer-motion";
import { Download, PhoneCall } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Counter } from "@/components/counter";

// Product data remains unchanged
const conductors = [
  {
    name: "ACSR Conductors",
    description:
      "Aluminum Conductor Steel Reinforced, designed for overhead transmission and distribution lines.",
    image: "/ACSR.png",
    specs: [
      "High tensile strength",
      "Excellent conductivity",
      "Weather resistant",
    ],
    applications: [
      "Main power transmission lines",
      "River crossings",
      "Long-span installations",
    ],
  },
  {
    name: "AAC Conductors",
    description:
      "All Aluminum Conductors, offering high electrical conductivity and corrosion resistance.",
    image: "/AAC.png",
    specs: [
      "Higher conductivity than ACSR",
      "Lighter weight",
      "Corrosion resistant",
    ],
    applications: [
      "Urban distribution networks",
      "Coastal area installations",
      "Industrial areas",
    ],
  },
  {
    name: "AAAC Conductors",
    description:
      "All Aluminum Alloy Conductors with balanced mechanical strength and electrical performance.",
    image: "/AAAC.png",
    specs: [
      "Higher strength than AAC",
      "Excellent corrosion resistance",
      "Good conductivity",
    ],
    applications: [
      "Medium voltage distribution",
      "Coastal and industrial areas",
      "Polluted environments",
    ],
  },
  {
    name: "ACCC Conductors",
    description:
      "Aluminum Conductor Alloy Reinforced, offering improved ampacity and mechanical strength.",
    image: "/ACCC.png",
    specs: [
      "High current carrying capacity",
      "Good mechanical strength",
      "Improved sag performance",
    ],
    applications: [
      "Uprating existing lines",
      "High-temperature operations",
      "Long-span transmission",
    ],
  },
];

const cables = [
  {
    name: "XLPE Insulated Power Cables",
    description:
      "High-quality cross-linked polyethylene insulated cables for reliable power distribution.",
    image: "/AluminiumCable.png",
    specs: [
      "Cross-linked polyethylene insulation",
      "Voltage grades: 0.6/1kV to 33kV",
      "Temperature rating up to 90°C",
    ],
    applications: [
      "Underground power distribution",
      "Commercial buildings",
      "Industrial facilities",
    ],
  },
  {
    name: "Aerial Bundled Cables",
    description:
      "Self-supporting insulated overhead cables for reliable distribution in challenging environments.",
    image: "/LT_Aerial_Bunched_Cable.png",
    specs: [
      "Insulated phase conductors",
      "Bare or insulated neutral",
      "UV resistant outer sheath",
    ],
    applications: [
      "Overhead distribution in urban areas",
      "Forested regions",
      "Coastal areas with high salt spray",
    ],
  },
  // {
  //   name: "Low Voltage Power Cables",
  //   description:
  //     "Reliable and efficient cables for low voltage power distribution applications.",
  //   image: "/aluminum-conductor-4.jpg",
  //   specs: [
  //     "Copper or aluminum conductors",
  //     "PVC or XLPE insulation",
  //     "Single and multi-core options",
  //   ],
  //   applications: [
  //     "Building wiring",
  //     "Light industrial applications",
  //     "Street lighting networks",
  //   ],
  // },
];

export default function Products() {
  return (
    <div style={{ background: "#ffffff" }}>
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-16 text-center">
            <h1 className="text-black mb-4">Our Products</h1>
            <p className="text-black mb-8 text-lg max-w-3xl mx-auto">
              Discover our comprehensive range of Conductors, Power and Ariel
              bunched Cables, engineered for excellence and reliability in both
              power transmission and distribution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6">
              <a
                href="/Urjatech Conductor Product Line .pdf"
                target="_blank"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="sm:w-auto font-black border-2 border-black text-black uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none text-sm sm:text-base"
                >
                  <Download size={16} className="mr-2" />
                  Download Catalog
                </Button>
              </a>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="sm:w-auto font-black border-2 border-black text-black uppercase bg-transparent hover:bg-transparent hover:text-[#01AEEF] hover:border-[#01AEEF] rounded-none text-sm sm:text-base"
                >
                  <PhoneCall size={16} className="mr-2" />
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>

          {/* Power Cables Section */}
          <section className="mb-20 pb-12 border-b border-black/20">
            <ScrollReveal
              animation={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
              }}
            >
              <div className="text-center mb-8">
                <h2 className="section-heading text-black">Power Cables</h2>
                <p className="text-black mb-4 max-w-3xl mx-auto">
                  Our power cables deliver reliable power distribution with
                  excellent thermal and electrical characteristics for various
                  industrial applications and electric utilities.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cables.map((product, index) => (
                <ScrollReveal
                  key={index}
                  animation={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.5 },
                  }}
                  delay={index * 100}
                >
                  <Card className="relative aspect-square overflow-hidden group rounded-none border-2 border-white ">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-125"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col justify-end text-white z-10">
                      <div className="mb-1 overflow-hidden">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-2 truncate">
                          {product.name}
                        </h3>
                        <p className="text-white text-sm md:text-base lg:text-lg mb-3 line-clamp-3">
                          {product.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 overflow-hidden">
                          <div>
                            <h4 className="text-xs md:text-sm font-bold uppercase mb-1 text-white/70">
                              Features:
                            </h4>
                            <ul className="space-y-0.5 md:space-y-1 line-clamp-3">
                              {product.specs.slice(0, 3).map((spec, i) => (
                                <li
                                  key={i}
                                  className="flex items-start text-xs md:text-sm truncate text-white"
                                >
                                  <span className="mr-1 text-primary">•</span>
                                  {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs md:text-sm font-bold uppercase mb-1 text-white/70">
                              Applications:
                            </h4>
                            <ul className="space-y-0.5 md:space-y-1 line-clamp-3">
                              {product.applications
                                .slice(0, 3)
                                .map((app, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start text-xs md:text-sm truncate text-white"
                                  >
                                    <span className="mr-1 text-primary">•</span>
                                    {app}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Conductors Section */}
          <section className="mb-20 pb-12 border-b border-white/20">
            <ScrollReveal
              animation={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
              }}
            >
              <div className="text-center mb-8">
                <h2 className="section-heading text-black">
                  Aluminum Conductors
                </h2>
                <p className="text-black mb-4 max-w-3xl mx-auto">
                  Our high-performance aluminum conductors are designed for
                  optimal power transmission with superior mechanical strength
                  and electrical conductivity.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {conductors.map((product, index) => (
                <ScrollReveal
                  key={index}
                  animation={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.5 },
                  }}
                  delay={index * 100}
                >
                  <Card className="relative aspect-square overflow-hidden group rounded-none border-2 border-white">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-125"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col justify-end text-white z-10">
                      <div className="mb-1 overflow-hidden">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-2 truncate">
                          {product.name}
                        </h3>
                        <p className="text-white text-sm md:text-base lg:text-lg mb-3 line-clamp-3">
                          {product.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 overflow-hidden">
                          <div>
                            <h4 className="text-xs md:text-sm font-bold uppercase mb-1 text-white/70">
                              Features:
                            </h4>
                            <ul className="space-y-0.5 md:space-y-1 line-clamp-3">
                              {product.specs.slice(0, 3).map((spec, i) => (
                                <li
                                  key={i}
                                  className="flex items-start text-xs md:text-sm truncate text-white"
                                >
                                  <span className="mr-1 text-primary">•</span>
                                  {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs md:text-sm font-bold uppercase mb-1 text-white/70">
                              Applications:
                            </h4>
                            <ul className="space-y-0.5 md:space-y-1 line-clamp-3">
                              {product.applications
                                .slice(0, 3)
                                .map((app, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start text-xs md:text-sm truncate text-white"
                                  >
                                    <span className="mr-1 text-primary">•</span>
                                    {app}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* End of Conductors Section */}
        </motion.div>
      </div>
    </div>
  );
}