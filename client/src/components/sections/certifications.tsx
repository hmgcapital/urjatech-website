import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const certifications = [
  {
    name: "BIS 7098",
    description: "Indian Standard allotted for manufacturing XLPE Power Cables - BIS 7098 (part-1)"
  },
  {
    name: "BIS 14255",
    description: "Indian Standard allotted for manufacturing AB Cables - BIS 14255"
  },
  {
    name: "BIS 398",
    description: "Indian Standards allotted for manufacturing high performance conductors - BIS 398 (1), 398 (2), 398 (4), 398 (5), 398 (6)"
  },
  {
    name: "ERDA & CPRI",
    description: "Type Tested from premier testing agency ERDA, Vadodara and C.P.R.I., Noida"
  },
  {
    name: "ISO 9001:2015",
    description: "Quality Management System"
  },
  {
    name: "ISO 14001:2015",
    description: "Environmental Management System"
  },
  {
    name: "OHSAS 18001:2007",
    description: "Occupational Health and Safety"
  },
  {
    name: "UL Certification",
    description: "Safety Standards Compliance"
  }
];

export default function Certifications() {
  return (
    <section className="py-16 relative bg-gray-50">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="section-heading text-gray-900">Quality Standards & Certifications</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to quality is backed by international certifications,
            Indian standards, and compliance with industry requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Card className="relative overflow-hidden group rounded-none border-2 border-gray-200 bg-white h-full flex flex-col">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="mb-2">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-900">{cert.name}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm flex-grow">{cert.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}