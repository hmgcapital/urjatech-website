import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://capitalurjatech.com";
const DIST_DIR = path.resolve("dist", "public");

const pages = {
  "/": {
    title: "Power Cables & Conductors Manufacturer India | Urjatech",
    description:
      "Urjatech manufactures high-quality ACSR, AAC, AAAC aluminum conductors and XLPE, ABC power cables for overhead transmission and distribution networks. Serving utilities across 15 states since 2011.",
  },
  "/products": {
    title: "Products | ACSR, AAC, XLPE Cables & Conductors | Urjatech",
    description:
      "Explore Urjatech's full range: ACSR, AAC, AAAC, ACCC, AL59 aluminum conductors and XLPE insulated cables, aerial bundled cables, and medium voltage covered conductors for power transmission and distribution.",
  },
  "/about": {
    title: "About Us | Power Cable Manufacturer Since 2011 | Urjatech",
    description:
      "Founded in 2011, Urjatech has grown into a trusted manufacturer of power cables and conductors. Discover our history, mission, leadership, and impact across India's power infrastructure.",
  },
  "/contact": {
    title: "Contact Us | Get a Quote for Power Cables | Urjatech",
    description:
      "Contact Urjatech for business enquiries, product quotes, or vendor registration. Reach us at cable@urjatech.com or +91 8800094446. Located in Ecotech-12, Greater Noida, India.",
  },
  "/careers": {
    title: "Careers | Join the Urjatech Team | Urjatech",
    description:
      "Explore career opportunities at Urjatech. Join a growing team of 100+ professionals committed to powering India's smart grid future with innovative cable and conductor solutions.",
  },
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function canonicalUrl(route) {
  return route === "/" ? `${BASE_URL}/` : `${BASE_URL}${route}`;
}

function replaceOrInsertHeadTag(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function applyMetadata(template, route, metadata) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = canonicalUrl(route);
  const image = `${BASE_URL}/factory.webp`;

  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceOrInsertHeadTag(
    html,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${image}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`,
  );
  html = replaceOrInsertHeadTag(
    html,
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${image}" />`,
  );

  return html;
}

const template = await readFile(path.join(DIST_DIR, "index.html"), "utf-8");

for (const [route, metadata] of Object.entries(pages)) {
  const html = applyMetadata(template, route, metadata);
  if (route === "/") {
    await writeFile(path.join(DIST_DIR, "index.html"), html);
    continue;
  }

  const routeDir = path.join(DIST_DIR, route);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}

