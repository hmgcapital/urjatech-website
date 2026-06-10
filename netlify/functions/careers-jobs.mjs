import fs from "node:fs";
import path from "node:path";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { message: "Method not allowed" });
  }

  try {
    const jobsPath = path.join(process.cwd(), "server", "jobs.json");
    const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf8"));
    return json(200, jobs.filter((job) => job.active !== false));
  } catch (err) {
    console.error("[careers-jobs] Could not read jobs:", err);
    return json(500, { message: "Could not load job openings." });
  }
}
