import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Factory, Shield, Zap, Award } from "lucide-react";

const features = [
  {
    icon: Factory,
    title: "State-of-the-art Manufacturing",
    description:
      "Our modern factory floor features advanced equipment for precise cable and conductor production with minimal tolerances.",
    image: "/AAC.png", // Updated image as manufacturing-1.jpg isn't working
  },
  {
    icon: Shield,
    title: "QUALITY ASSURANCE",
    description:
      "Every product undergoes rigorous inspection and testing to ensure the highest level of reliability and safety.",
    image: "/manufacturing-2.jpg", // Quality control inspection with testing equipment
  },
  {
    icon: Zap,
    title: "Advanced Technology",
    description:
      "We utilize the latest technological innovations in our production lines for superior electrical performance.",
    image: "/manufacturing-3.jpg", // Advanced machinery for electrical cable manufacturing
  },
  {
    icon: Award,
    title: "Industry Standards",
    description:
      "Our processes and products meet or exceed international safety and quality standards like ISO and IEC.",
    image: "/ACSR.png", // Updated image as manufacturing-4.jpg isn't working
  },
];

export default function Manufacturing() {
  return (
    <section className="py-16 relative bg-gray-50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 mt-10">
          <h2 className="section-heading text-gray-900">
            Manufacturing Excellence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to quality and innovation drives our manufacturing
            processes, ensuring the highest standards in every product we
            deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
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
                    backgroundImage: `url(${feature.image})`,
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-end text-white z-10">
                  <div className="w-full">
                    <h3 className="text-3xl font-black mb-2 break-words hyphens-auto">
                      {feature.title.toUpperCase()}
                    </h3>
                    <p className="text-white/80 text-base line-clamp-3 break-words">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}