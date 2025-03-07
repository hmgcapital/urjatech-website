import { motion } from "framer-motion";
const customersRow1 = [
  { name: "Company 1", logo: "/customers/9.gif" },
  { name: "Company 2", logo: "/customers/10.gif" },
  { name: "Company 3", logo: "/customers/11.gif" },
  { name: "Company 4", logo: "/customers/12.gif" },
  { name: "Company 5", logo: "/customers/13.gif" },
  { name: "Company 6", logo: "/customers/14.gif" },
  { name: "Company 7", logo: "/customers/15.gif" },
  { name: "Company 8", logo: "/customers/16.gif" },
  { name: "Company 9", logo: "/customers/17.gif" },
];

const customersRow2 = [
  { name: "Company 10", logo: "/customers/19.gif" },
  { name: "Company 11", logo: "/customers/24.gif" },
  { name: "Company 12", logo: "/customers/20.gif" },
  { name: "Company 13", logo: "/customers/21.gif" },
  { name: "Company 14", logo: "/customers/23.gif" },
  { name: "Company 15", logo: "/customers/25.gif" },
  { name: "Company 16", logo: "/customers/26.gif" },
  { name: "Company 17", logo: "/customers/27.gif" },
  { name: "Company 18", logo: "/customers/28.gif" },
];

// Fewer logos for mobile display
const customersRow1Mobile = [
  { name: "Company 1", logo: "/customers/9.gif" },
  { name: "Company 3", logo: "/customers/11.gif" },
  { name: "Company 5", logo: "/customers/13.gif" },
  { name: "Company 7", logo: "/customers/15.gif" },
  { name: "Company 9", logo: "/customers/17.gif" },
];

const customersRow2Mobile = [
  { name: "Company 10", logo: "/customers/19.gif" },
  { name: "Company 12", logo: "/customers/20.gif" },
  { name: "Company 14", logo: "/customers/23.gif" },
  { name: "Company 16", logo: "/customers/26.gif" },
  { name: "Company 18", logo: "/customers/28.gif" },
];

export default function Customers() {
  return (
    <section className="py-16 relative bg-white w-screen relative left-[calc(-50vw+50%)] right-[calc(-50vw+50%)]">
      <div className="max-w-screen-2xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="section-heading text-gray-900">
            Our Trusted Customers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Industry leaders who rely on our quality products and services
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-[94rem] mx-auto space-y-6"
        >
          {/* First row of logos - left to right */}
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_28%,_black_calc(100%-28%),transparent_100%)]">
            {/* Desktop version */}
            <div className="hidden md:flex items-center justify-between min-w-full animate-infinite-scroll">
              {customersRow1.map((customer, index) => (
                <div key={`row1-${index}`} className="relative mx-6 lg:mx-8">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] xl:w-[150px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
            
            {/* Mobile version with fewer logos */}
            <div className="flex md:hidden items-center justify-between min-w-full animate-infinite-scroll">
              {customersRow1Mobile.map((customer, index) => (
                <div key={`row1-mobile-${index}`} className="relative mx-4">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>

            {/* Duplicate set for seamless looping - Desktop */}
            <div className="hidden md:flex items-center justify-between min-w-full animate-infinite-scroll" aria-hidden="true">
              {customersRow1.map((customer, index) => (
                <div key={`row1-dup-${index}`} className="relative mx-6 lg:mx-8">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] xl:w-[150px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless looping - Mobile */}
            <div className="flex md:hidden items-center justify-between min-w-full animate-infinite-scroll" aria-hidden="true">
              {customersRow1Mobile.map((customer, index) => (
                <div key={`row1-dup-mobile-${index}`} className="relative mx-4">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Second row of logos - right to left */}
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_28%,_black_calc(100%-28%),transparent_100%)]">
            {/* Desktop version */}
            <div className="hidden md:flex items-center justify-between min-w-full animate-infinite-scroll-reverse">
              {customersRow2.map((customer, index) => (
                <div key={`row2-${index}`} className="relative mx-6 lg:mx-8">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] xl:w-[150px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
            
            {/* Mobile version with fewer logos */}
            <div className="flex md:hidden items-center justify-between min-w-full animate-infinite-scroll-reverse">
              {customersRow2Mobile.map((customer, index) => (
                <div key={`row2-mobile-${index}`} className="relative mx-4">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>

            {/* Duplicate set for seamless looping - Desktop */}
            <div className="hidden md:flex items-center justify-between min-w-full animate-infinite-scroll-reverse" aria-hidden="true">
              {customersRow2.map((customer, index) => (
                <div key={`row2-dup-${index}`} className="relative mx-6 lg:mx-8">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] xl:w-[150px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless looping - Mobile */}
            <div className="flex md:hidden items-center justify-between min-w-full animate-infinite-scroll-reverse" aria-hidden="true">
              {customersRow2Mobile.map((customer, index) => (
                <div key={`row2-dup-mobile-${index}`} className="relative mx-4">
                  <img
                    src={customer.logo}
                    alt={customer.name}
                    className="w-[120px] h-auto object-contain hover:scale-105 transition-all duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}