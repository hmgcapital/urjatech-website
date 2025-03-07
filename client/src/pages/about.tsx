import { motion } from "framer-motion";
import { Shield, Award, Factory, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Counter } from "@/components/counter";

export default function About() {
  const leadership = [
    {
      name: "Shray Gupta",
      position: "Managing Director",
      image: "/shray.png",
      bio: "Leading Urjatech's vision with over 15 years of experience in power solutions.",
    },
    {
      name: "Arjun Mehta",
      position: "Chief Technology Officer",
      image: "/shray.png", // Using placeholder image
      bio: "Driving innovation in cable technology with expertise in electrical engineering.",
    },
  ];
  return (
    <div style={{ background: "#ffffff" }}>
      {" "}
      {/* Changed background to white */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-black mb-6 text-black">
            {" "}
            {/* Changed text color to black */}
            About Urjatech
          </h1>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 text-lg">
              Urjatech is a leading manufacturer of power cables and electrical
              solutions, serving industries worldwide with high-quality products
              and innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="rounded-none border-2 border-gray-200 bg-white">
              {" "}
              {/* Changed background and border color */}
              <CardContent className="p-6">
                <h2 className="text-3xl font-black mb-4 text-gray-900">
                  {" "}
                  {/* Changed text color to dark gray */}
                  Our History
                </h2>
                <p className="text-gray-700">
                  {" "}
                  {/* Changed text color to gray */}
                  Founded in 1995, Urjatech has grown from a small local
                  manufacturer to a global leader in power cable solutions. Our
                  journey has been marked by continuous innovation and
                  unwavering commitment to quality.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 border-gray-200 bg-white">
              {" "}
              {/* Changed background and border color */}
              <CardContent className="p-6">
                <h2 className="text-3xl font-black mb-4 text-gray-900">
                  {" "}
                  {/* Changed text color to dark gray */}
                  Our Mission
                </h2>
                <p className="text-gray-700">
                  {" "}
                  {/* Changed text color to gray */}
                  To provide innovative and reliable power cable solutions that
                  enable our customers to achieve their goals while maintaining
                  the highest standards of quality and safety.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quotes Section - Banner Style */}
          <section className="py-20 bg-blue-500 w-screen relative left-[calc(-50vw+50%)] right-[calc(-50vw+50%)]">
            <div className="max-w-screen-2xl mx-auto px-4">
              {[
                {
                  quote:
                    "Quality is not an act, it's a habit. We build excellence into every cable we produce.",
                },
                {
                  quote:
                    "Innovation is the ability to see change as an opportunity, not a threat.",
                },
                {
                  quote:
                    "The strength of our cables is matched only by the strength of our commitment to our customers.",
                },
                {
                  quote:
                    "Great things in business are never done by one person. They're done by a team of people.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className={index === 0 ? "block" : "hidden"}
                >
                  <div className="text-center py-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 max-w-5xl mx-auto leading-tight">
                      {item.quote}
                    </h2>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Leadership section */}
          <section className="py-16 relative bg-gradient-to-b from-white to-gray-50 w-screen relative left-[calc(-50vw+50%)] right-[calc(-50vw+50%)]">
            <div className="max-w-screen-2xl mx-auto px-4 relative z-10">
              <div className="text-center mb-12 mt-10">
                <h2 className="section-heading text-gray-900">
                  Our Leadership
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Meet the team driving our vision and commitment to excellence
                  in the power industry.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Left Column - Leadership Quote */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <div className="border-l-4 border-[#01AEEF] pl-6">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                      "Our commitment to innovation drives us to engineer
                      solutions that empower industries across the globe."
                    </h3>
                    <p className="text-[#01AEEF] font-bold text-xl">
                      — Shray Gupta, Managing Director
                    </p>
                  </div>
                </motion.div>

                {/* Right Column - Leadership Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {leadership.map((leader, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex flex-col h-full"
                    >
                      <Card className="relative h-96 overflow-hidden group rounded-none border-0 shadow-md flex-grow">
                        {/* Background Image with Gradient */}
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${leader.image})`,
                          }}
                        />
                      </Card>

                      {/* Leader info below image */}
                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {leader.name}
                        </h3>
                        <p className="text-[#01AEEF] font-medium">
                          {leader.position}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-20 bg-white w-screen relative left-[calc(-50vw+50%)] right-[calc(-50vw+50%)]">
            {" "}
            {/* Changed background to white */}
            <div className="max-w-screen-2xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="section-heading text-gray-900">
                  {" "}
                  {/* Changed text color to dark gray */}Our Impact
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  {" "}
                  {/* Changed text color to gray */}
                  Since our founding, we've led the industry with quality
                  products and extensive reach. Delivering excellence and
                  empowering communities across the globe.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {/* First Row - Always 3 items */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {[
                    { number: 25, label: "Years Experience", suffix: "+" },
                    { number: 120, label: "Projects Completed", suffix: "+" },
                    { number: 35, label: "Countries Served", suffix: "+" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="w-[48%] sm:w-[30%] min-w-[140px] max-w-[300px]"
                    >
                      <Card className="text-center py-2 px-2 bg-white border-0">
                        <h3 className="text-6xl md:text-7xl font-black text-[#01AEEF] mb-1">
                          <Counter end={stat.number} suffix={stat.suffix} />
                        </h3>
                        <p className="text-gray-700 text-xs uppercase tracking-wider font-bold">
                          {stat.label}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {/* Second Row */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {[
                    { number: 450, label: "Satisfied Clients", suffix: "+" },
                    { number: 500, label: "Team Members", suffix: "+" },
                    { number: 98, label: "Customer Satisfaction", suffix: "%" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="w-[48%] sm:w-[30%] min-w-[140px] max-w-[300px]"
                    >
                      <Card className="text-center py-2 px-2 bg-white border-0">
                        <h3 className="text-6xl md:text-7xl font-black text-[#01AEEF] mb-1">
                          <Counter end={stat.number} suffix={stat.suffix} />
                        </h3>
                        <p className="text-gray-700 text-xs uppercase tracking-wider font-bold">
                          {stat.label}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
