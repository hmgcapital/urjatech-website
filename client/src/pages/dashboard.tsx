import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full aspect-[16/9] shadow-lg rounded-lg overflow-hidden">
            <iframe
              src="https://app.powerbi.com/view?r=eyJrIjoiNDUzYzBmZDMtYWNkYS00NWVmLThiYmEtYWFkM2EyYzUxOWY5IiwidCI6Ijk2YmRhNWVjLTcwYTgtNDkzYS05YjBlLTZjM2I4YjQxMTlhOSJ9"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              allowFullScreen
              title="PowerBI Dashboard"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
