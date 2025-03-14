import { Link } from "wouter";
import { Linkedin, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-gray-900 relative bg-white">
      {/* Background Image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/footer.png')",
          opacity: 0.1,
        }}
      />

      <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img
                src="/URJATECH LOGO.png"
                alt="Urjatech Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600">
              Leading manufacturer of power cables and electrical solutions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://maps.google.com/?q=115,+Ecotech-12,+UP-201318,+India"
                target="_blank"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <MapPin size={20} />
              </a>
              <a
                href="tel:+918800094446"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Phone size={20} />
              </a>
              <a
                href="mailto:cable@urjatech.com"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-blue-500 transition-colors">Products</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-600">
              <li>XLPE Power Cables</li>
              <li>Traditional Conductors</li>
              <li>High performance and HTLS conductors</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <address className="not-italic text-sm space-y-2 text-gray-600">
              <p>Urjatech Private Limited</p>
              <p>115, Ecotech-12</p>
              <p>UP-201318, India</p>
              <p>Phone: +91 8800094446</p>
              <p>Email: cable@urjatech.com</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Urjatech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}