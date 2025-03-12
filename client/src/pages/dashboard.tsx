
import { motion } from "framer-motion";
import { useState } from "react";

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "harsh") {
      setAuthenticated(true);
    } else {
      setError("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-2xl font-bold mb-4">Dashboard Access</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-2 border rounded"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

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
