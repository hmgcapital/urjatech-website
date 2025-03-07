import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "John Smith",
    company: "Power Solutions Inc.",
    content: "Urjatech's power cables have exceeded our quality expectations consistently. Their technical expertise and commitment to delivering premium products have made them our trusted supplier for over five years.",
    initials: "JS"
  },
  {
    name: "Sarah Johnson",
    company: "Industrial Systems Ltd.",
    content: "Working with Urjatech has significantly improved our project delivery timelines. Their responsive support team and high-quality products have helped us maintain our reputation for excellence in industrial installations.",
    initials: "SJ"
  },
  {
    name: "Michael Chen",
    company: "Global Energy Corp",
    content: "The durability and performance of Urjatech's cables are unmatched in the industry. Their engineering team's attention to detail and commitment to innovation have made them an invaluable partner in our operations.",
    initials: "MC"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!autoSlide) return;

    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [current, autoSlide]);

  return (
    <section className="py-16 relative" style={{ background: "#000000" }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="section-heading text-white">What Our Clients Say</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued clients have to say about our products and services.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <Card className="w-full max-w-xl shadow-lg border border-gray-800 bg-gray-900 text-white">
                  <CardHeader>
                    <div className="flex items-center"> {/* Added flex container */}
                      <Avatar className="h-10 w-10 mr-4 bg-primary text-white">
                        <AvatarFallback>{testimonials[current].initials}</AvatarFallback>
                      </Avatar>
                      <div> {/* Container for name and company */}
                        <p className="font-semibold text-white">{testimonials[current].name}</p>
                        <p className="text-sm text-white/70">{testimonials[current].company}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">{testimonials[current].content}</p>
                  </CardContent>
                  {/* Removed redundant CardFooter */}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                prevSlide();
                setAutoSlide(false);
              }}
              className="rounded-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>

            <div className="flex gap-1 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === current ? "bg-primary w-4" : "bg-white/30"
                  }`}
                  onClick={() => {
                    setCurrent(index);
                    setAutoSlide(false);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                nextSlide();
                setAutoSlide(false);
              }}
              className="rounded-full bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}