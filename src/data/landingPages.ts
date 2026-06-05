import type { LandingPageContent } from "@/components/LandingPage"

export const hrLandingContent: LandingPageContent = {
  badge: "Open to AI Automation & Full-Stack Engineering roles",
  heroPrefix: "I build",
  heroHighlight: "AI-powered automation",
  heroSuffix: "that scales real operations.",
  heroDescription:
    "AI Automation Engineer & Full-Stack Developer — I design intelligent workflow systems, build LLM-integrated tooling, and ship production-grade web applications end to end.",
  primaryAction: "Review Engineering Work",
  secondaryAction: "View Contact Details",
  secondaryHref: "/contact",
  process: {
    label: "Engineering approach",
    title: "From Ambiguity to Production",
    description: "How I scope, design, and deliver AI-driven systems that fit the real operation.",
  },
  timeline: [
    {
      stepNumber: "01 / UNDERSTAND",
      stepName: "Problem Scoping",
      title: "Finding Where AI Adds Real Leverage",
      desc: "Map the manual workflow, identify where intelligence reduces friction, and define the minimal system that meaningfully improves the operation.",
    },
    {
      stepNumber: "02 / ARCHITECT",
      stepName: "System Design",
      title: "Designing the Intelligent Layer",
      desc: "Model data flows, design LLM integration points, define API boundaries, and establish clear fallback behaviour for when automation breaks.",
    },
    {
      stepNumber: "03 / SHIP",
      stepName: "Production Delivery",
      title: "Building Past the Prototype",
      desc: "Implement, observe in production, close the feedback loop, and refine the automation around real usage rather than demo conditions.",
    },
  ],
  featured: {
    label: "Selected case studies",
    title: "Systems Built End to End",
    description: "Architecture, implementation decisions, and outcomes across the core platforms in my engineering portfolio.",
  },
  additional: {
    label: "Additional work",
    title: "More Technical Builds",
    description: "Selected utilities, product experiments, and supporting software projects.",
  },
  ctaLabel: "Available for AI & Full-Stack engineering roles",
  ctaTitle: "Looking for an engineer who can build and ship AI-integrated systems?",
  ctaDescription:
    "I bring AI automation expertise, full-stack execution, and product judgment to teams building intelligent software that needs to work reliably in production.",
  ctaAction: "Start a Conversation",
  ctaHref: "/contact",
  cvHref: "/Malik_Hashir_CV.pdf",
  showProcess: true,
  showTechFilter: true,
  availability: { label: "Open to new roles · GST", active: true },
  currentFocus: "Building LLM workflow tooling + Next.js systems",
  email: "magnotekbyasool@gmail.com",
  whatsappNumber: "971504442178",
  socialLinks: {
    github: "https://github.com/iamhashir",
    linkedin: "https://linkedin.com/in/malikhashir",
  },
}

export const clientLandingContent: LandingPageContent = {
  badge: "Available for contract projects",
  heroPrefix: "I engineer",
  heroHighlight: "operational chaos",
  heroSuffix: "into scalable software.",
  heroDescription:
    "With a foundation in sales and event operations, I audit business workflows and build the bespoke technical infrastructure needed to scale them.",
  primaryAction: "View System Architecture",
  secondaryAction: "Talk Operations",
  secondaryHref: "/contact",
  process: {
    label: "Execution plan",
    title: "Methodical Development",
    description: "How I take systems from messy paper checklists to automated operations code.",
  },
  timeline: [
    {
      stepNumber: "01 / SCOPE",
      stepName: "Discovery & Scope",
      title: "Uncovering Operational Bottlenecks",
      desc: "Analyze spreadsheet pipelines, manual check sheets, and email loops to isolate operational friction and outline a database schema.",
    },
    {
      stepNumber: "02 / ARCHITECT",
      stepName: "System Architecture",
      title: "Mapping Models & Workflows",
      desc: "Design data models, background worker flows, API structures, and permission rules around the real operating process.",
    },
    {
      stepNumber: "03 / DELIVER",
      stepName: "Deployment & Audit",
      title: "Production Release & Training",
      desc: "Roll out the operational dashboards, integrate communication gateways, and run real-world transaction testing.",
    },
  ],
  featured: {
    label: "Featured systems",
    title: "Core Operational Platforms",
    description: "Deep architecture breakdowns and outcomes for systems designed for core business processes.",
  },
  additional: {
    label: "Additional infrastructure",
    title: "Supporting Builds",
    description: "Selected client setups, utility structures, and standalone software products.",
  },
  ctaLabel: "Available for contract projects",
  ctaTitle: "Need an operational system that fits the way your team works?",
  ctaDescription:
    "I scope workflow bottlenecks, design the data model, and build the interface around the real process.",
  ctaAction: "Discuss a System",
  ctaHref: "/contact",
}
