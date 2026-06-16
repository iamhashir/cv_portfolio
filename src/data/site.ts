// ─── Single source of truth for all personal/site data ────────
// Change anything here and it propagates everywhere automatically.

export const site = {
  // ── Identity ──────────────────────────────────────────────────
  name:     "Malik Hashir",
  domain:   "malik-hashir.dev",
  email:    "magnotekbyasool@gmail.com",
  location: "Abu Dhabi, UAE",

  // ── Professional ──────────────────────────────────────────────
  role:  "Full-Stack & AI Engineer",
  roles: ["Full-Stack Developer", "AI Automations Engineer", "Systems Architect"] as const,

  bio: "Full-stack developer building CRM, workflow automation, and internal operations tools. Custom operations software and AI-assisted workflows in React, TS, and Node.js.",

  availability:
    "Currently open to technical contracts, operations system consulting, and full-stack software development roles in Abu Dhabi and remote worldwide.",

  // ── Social / Links ────────────────────────────────────────────
  github:         "https://github.com/ihashirr",
  githubHandle:   "ihashirr",
  linkedin:       "https://linkedin.com/in/malikhashir",
  linkedinHandle: "linkedin.com/in/malikhashir",
  cvPath:         "/Malik_Hashir_CV.pdf",

  // ── SEO ───────────────────────────────────────────────────────
  seo: {
    title:       "Malik Hashir | Full-Stack Developer for CRM & Business Systems",
    description: "Full-stack developer building CRM, workflow automation, and internal operations tools. Custom operations software and AI-assisted workflows in React, TS, and Node.js.",
    keywords: [
      "Malik Hashir", "Full Stack Developer", "CRM", "Automation",
      "Operations Software", "Internal Tools", "React", "TypeScript",
      "Node.js", "Abu Dhabi", "UAE",
    ],
  },

  // ── Navigation ────────────────────────────────────────────────
  navLinks: [
    { name: "Home",    href: "/"        },
    { name: "Work",    href: "/work"    },
    { name: "About",   href: "/about"   },
    { name: "Contact", href: "/contact" },
  ],

  // ── Splash terminal lines ─────────────────────────────────────
  splashLines: [
    { prefix: ">", text: "ssh malik@malik-hashir.dev" },
    { prefix: "✓", text: "connected  ·  latency 12ms" },
    { prefix: "✓", text: "build: PASSING  ·  tests: 100%" },
    { prefix: "✓", text: "uptime: 99.98%  ·  last deploy: 2m ago" },
    { prefix: "",  text: "" },
  ],
}

// Convenience shorthand used in project URLs
export const githubBase = `https://github.com/${site.githubHandle}`
