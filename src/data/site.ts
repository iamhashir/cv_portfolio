// ─── Single source of truth for all personal/site data ────────
// Change anything here and it propagates everywhere automatically.

export const site = {
  // ── Identity ──────────────────────────────────────────────────
  name:     "Malik Hashir",
  domain:   "malik-hashir.dev",
  email:    "magnotekbyasool@gmail.com",
  location: "Abu Dhabi, UAE",

  // ── Professional ──────────────────────────────────────────────
  role:  "Software Engineer — Full-Stack, AI & Systems",
  roles: ["Full-Stack Engineer", "AI Automation Engineer", "Systems Engineer"] as const,

  bio: "Software engineer building full-stack business systems, real-time applications, and AI automation. I work across React/Next.js, TypeScript, Node.js, APIs, databases, and systems-level engineering.",

  availability:
    "Open to software engineering roles in the UAE and remote, with a focus on full-stack, backend, AI automation, and real-time systems.",

  // ── Social / Links ────────────────────────────────────────────
  github:         "https://github.com/iamhashir",
  githubHandle:   "iamhashir",
  linkedin:       "https://linkedin.com/in/malikhashir",
  linkedinHandle: "linkedin.com/in/malikhashir",
  cvPath:         "/Malik_Hashir_CV.pdf",

  // ── SEO ───────────────────────────────────────────────────────
  seo: {
    title:       "Malik Hashir | Software Engineer — Full-Stack, AI & Systems",
    description: "Software engineer building full-stack business systems, real-time applications, and AI automation with React, Next.js, TypeScript, Node.js, APIs, and databases.",
    keywords: [
      "Malik Hashir", "Software Engineer", "Full Stack Engineer", "AI Automation",
      "Systems Engineering", "CRM", "Operations Software", "React", "Next.js",
      "TypeScript", "Node.js", "PostgreSQL", "Abu Dhabi", "UAE",
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
