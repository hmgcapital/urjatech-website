import { motion } from "framer-motion";

export default function Careers() {
  return (
    <div style={{ background: "#ffffff" }}>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
            Careers
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Join the Urjatech team. Submit your application below and we'll get
            back to you.
          </p>

          {/* Application form will be added here */}
          <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-200 rounded-sm">
            <p className="text-lg">Application form coming soon.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
