import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();
const BASE_URL = "https://capitalurjatech.com";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

const defaultMetadata: PageMetadata = {
  title: "Power Cables & Conductors Manufacturer India | Urjatech",
  description:
    "Urjatech manufactures high-quality ACSR, AAC, AAAC aluminum conductors and XLPE, ABC power cables for overhead transmission and distribution networks. Serving utilities across 15 states since 2011.",
  path: "/",
};

const pageMetadata: Record<string, PageMetadata> = {
  "/": defaultMetadata,
  "/products": {
    title: "Products | ACSR, AAC, XLPE Cables & Conductors | Urjatech",
    description:
      "Explore Urjatech's full range: ACSR, AAC, AAAC, ACCC, AL59 aluminum conductors and XLPE insulated cables, aerial bundled cables, and medium voltage covered conductors for power transmission and distribution.",
    path: "/products",
  },
  "/about": {
    title: "About Us | Power Cable Manufacturer Since 2011 | Urjatech",
    description:
      "Founded in 2011, Urjatech has grown into a trusted manufacturer of power cables and conductors. Discover our history, mission, leadership, and impact across India's power infrastructure.",
    path: "/about",
  },
  "/contact": {
    title: "Contact Us | Get a Quote for Power Cables | Urjatech",
    description:
      "Contact Urjatech for business enquiries, product quotes, or vendor registration. Reach us at cable@urjatech.com or +91 8800094446. Located in Ecotech-12, Greater Noida, India.",
    path: "/contact",
  },
  "/careers": {
    title: "Careers | Join the Urjatech Team | Urjatech",
    description:
      "Explore career opportunities at Urjatech. Join a growing team of 100+ professionals committed to powering India's smart grid future with innovative cable and conductor solutions.",
    path: "/careers",
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizePath(url: string) {
  const pathname = new URL(url, BASE_URL).pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function canonicalUrl(metadata: PageMetadata) {
  return metadata.path === "/" ? `${BASE_URL}/` : `${BASE_URL}${metadata.path}`;
}

function replaceOrInsertHeadTag(html: string, pattern: RegExp, replacement: string) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function injectPageMetadata(html: string, requestUrl: string) {
  const metadata = pageMetadata[normalizePath(requestUrl)] ?? defaultMetadata;
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = canonicalUrl(metadata);
  const image = metadata.image ?? `${BASE_URL}/factory.webp`;

  let page = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  page = replaceOrInsertHeadTag(
    page,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${image}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`,
  );
  page = replaceOrInsertHeadTag(
    page,
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${image}" />`,
  );

  return page;
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = injectPageMetadata(template, url);
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res, next) => {
    try {
      const template = await fs.promises.readFile(
        path.resolve(distPath, "index.html"),
        "utf-8",
      );
      res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(injectPageMetadata(template, req.originalUrl));
    } catch (error) {
      next(error);
    }
  });
}
