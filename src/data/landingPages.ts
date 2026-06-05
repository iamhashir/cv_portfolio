import type { LandingPageContent } from "@/components/LandingPage"

export const hrLandingContent: LandingPageContent = {
  badge: "Open to full-stack engineering roles",
  heroPrefix: "I turn",
  heroHighlight: "operational complexity",
  heroSuffix: "into reliable software.",
  heroDescription:
    "A product-minded full-stack developer with hands-on operations experience, building practical systems across workflow automation, CRM, and internal tooling.",
  primaryAction: "Review Engineering Work",
  secondaryAction: "View Contact Details",
  secondaryHref: "/contact",
  process: {
    label: "Engineering approach",
    title: "From Ambiguity to Production",
    description: "The decisions behind the systems: product judgment, architecture, and disciplined delivery.",
  },
  timeline: [
    {
      stepNumber: "01 / UNDERSTAND",
      stepName: "Product Judgment",
      title: "Finding the Real Constraint",
      desc: "Start with the operating problem, isolate the bottleneck, and define the smallest system that materially improves the workflow.",
    },
    {
      stepNumber: "02 / ARCHITECT",
      stepName: "System Design",
      title: "Designing for Real Usage",
      desc: "Translate requirements into data models, service boundaries, interface states, and clear operational ownership.",
    },
    {
      stepNumber: "03 / SHIP",
      stepName: "Production Delivery",
      title: "Building Through the Last Mile",
      desc: "Implement, verify, deploy, and refine the system around actual usage rather than stopping at a polished prototype.",
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
  ctaLabel: "Available for the right engineering team",
  ctaTitle: "Looking for an engineer who understands the operation behind the interface?",
  ctaDescription:
    "I bring full-stack execution, product judgment, and practical operating context to software teams building tools that need to work in the real world.",
  ctaAction: "Start a Conversation",
  ctaHref: "/contact",
  cvHref: "/Malik_Hashir_CV.pdf",
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
