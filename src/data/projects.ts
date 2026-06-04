export const projectCategoryGroups = [
  "CRM / Ops",
  "AI",
  "Realtime",
  "Framework / Systems",
] as const

export type ProjectCategoryGroup = (typeof projectCategoryGroups)[number]

type ProjectArchitecture = {
  frontend: string
  backend: string
  database: string
  integrations?: string[]
  deployment?: string
}

export type Project = {
  id: string
  slug: string
  title: string
  category: string
  categoryGroup: ProjectCategoryGroup
  summary: string
  role: string
  status: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  year: string
  targetUsers: string
  problem: string
  solution: string
  features: string[]
  architecture: ProjectArchitecture
  technicalDecisions: string
  challenges: string[]
  outcome: string[]
  metric?: string
  reflection: string[]
}

export const projects: Project[] = [
  {
    id: "reactor",
    slug: "reactor",
    title: "Reactor Framework",
    category: "Architecture & Frameworks",
    categoryGroup: "Framework / Systems",
    summary: "A lightweight frontend framework and rendering engine built from first principles, with a custom JSX runtime, hooks system, and file-based routing.",
    role: "Framework Engineer",
    status: "Public repository // 2024",
    techStack: ["TypeScript", "JSX Runtime", "Hooks", "File-based Routing", "Rendering Engine"],
    githubUrl: "https://github.com/ihashirr/reactor",
    featured: true,
    year: "2024",
    targetUsers: "Frontend engineers exploring framework internals and lightweight application runtimes.",
    problem: "Modern frontend libraries hide much of the rendering lifecycle behind abstractions. Reactor explores how a compact framework can provide familiar application primitives while keeping routing, state, and rendering behavior understandable.",
    solution: "Built a lightweight frontend framework from first principles, including a JSX runtime, component rendering pipeline, hooks system, and file-based router.",
    features: [
      "Custom JSX runtime for translating component syntax into renderable nodes",
      "Hooks system for component-level state and lifecycle behavior",
      "File-based routing with dynamic route support",
      "Route-scoped state isolation",
      "Rendering pipeline implemented without a third-party UI framework",
    ],
    architecture: {
      frontend: "Custom TypeScript component runtime responsible for JSX evaluation, hooks, and view updates.",
      backend: "No application backend is required for the framework core; routing and rendering behavior run in the client runtime.",
      database: "No persistent database is required by the core framework.",
      integrations: ["TypeScript compiler", "Browser DOM APIs"],
      deployment: "Static web hosting or integration inside a frontend project",
    },
    technicalDecisions: "The framework keeps its core intentionally small so the rendering lifecycle remains inspectable. Implementing JSX evaluation, hooks, and routing directly makes the trade-offs visible instead of delegating them to a larger dependency.",
    challenges: [
      "Predictable rendering lifecycle. Component updates and hook execution need a stable order so local state changes do not produce inconsistent UI output.",
      "Route-scoped state isolation. Navigation behavior must avoid leaking state between route trees while still keeping dynamic routes practical.",
    ],
    outcome: [
      "Built a complete rendering pipeline without third-party UI libraries.",
      "Engineered route-scoped state isolation and dynamic routing.",
      "Created a compact framework for studying predictable rendering behavior.",
    ],
    metric: "Zero-dependency rendering engine · custom JSX + hooks from scratch",
    reflection: [
      "Framework code benefits from a narrow core with explicit lifecycle rules.",
      "Routing and state ownership should be designed together.",
      "Small runtime experiments are useful for understanding the abstractions used by larger libraries.",
    ],
  },
  {
    id: "mina-games",
    slug: "mina-games",
    title: "MINA GAMES",
    category: "Real-time Multiplayer Platform",
    categoryGroup: "Realtime",
    summary: "A real-time multiplayer platform with matchmaking, tournaments, and WebSocket-based gameplay, built as a collaborative full-stack product.",
    role: "Product Owner & Full-Stack Engineer",
    status: "Public repository // 2024",
    techStack: ["Fastify", "WebSockets", "Prisma", "Docker", "NGINX", "TypeScript"],
    githubUrl: "https://github.com/ihashirr/mina-games",
    featured: true,
    year: "2024",
    targetUsers: "Players joining real-time matches, tournaments, and multiplayer sessions.",
    problem: "A multiplayer platform has to coordinate user sessions, match state, and tournament flows while keeping interactions responsive across multiple connected clients.",
    solution: "Built a full-stack multiplayer platform with WebSocket-based gameplay, matchmaking, tournaments, and a custom frontend architecture.",
    features: [
      "Real-time multiplayer gameplay over persistent WebSocket connections",
      "Matchmaking and tournament flows",
      "Player session and application data managed through a typed backend",
      "Containerized runtime behind NGINX",
      "Custom JSX-based frontend architecture",
    ],
    architecture: {
      frontend: "TypeScript client using a custom JSX runtime for interactive multiplayer screens.",
      backend: "Fastify services coordinate HTTP requests and persistent WebSocket sessions.",
      database: "Prisma provides typed access to persistent application data.",
      integrations: ["WebSockets", "Docker", "NGINX"],
      deployment: "Containerized application runtime",
    },
    technicalDecisions: "Persistent WebSocket connections are central to the platform because match interactions require continuous two-way communication. Fastify, Prisma, Docker, and NGINX provide a typed and deployable service foundation around that real-time core.",
    challenges: [
      "Coordinating real-time state. Gameplay events need to stay synchronized across active clients without turning the UI into the source of truth.",
      "Managing product scope across a collaborative build. Matchmaking, tournaments, gameplay, and infrastructure have to remain coherent as separate contributors ship features.",
    ],
    outcome: [
      "Implemented real-time state synchronization for multiplayer sessions.",
      "Developed frontend architecture using a custom JSX runtime.",
      "Coordinated a cross-functional team across the product lifecycle.",
    ],
    metric: "Real-time sync across connected clients · WebSocket backbone",
    reflection: [
      "Real-time features need clear server and client ownership boundaries.",
      "A multiplayer product benefits from treating infrastructure as part of the user experience.",
      "Shared interfaces reduce coordination cost across a collaborative build.",
    ],
  },
  {
    id: "opsflow",
    slug: "opsflow",
    title: "OpsFlow",
    category: "Operations Automation",
    categoryGroup: "CRM / Ops",
    summary: "Custom CRM and ERM workflows for order tracking, purchases, balance sheets, sales reporting, and customer communication.",
    role: "Full-Stack Developer",
    status: "Public repository // 2023",
    techStack: ["React", "JavaScript", "Firebase", "WhatsApp Automation"],
    githubUrl: "https://github.com/ihashirr/opsflow",
    featured: true,
    year: "2023",
    targetUsers: "Operations staff, sales teams, and managers replacing spreadsheet-based workflows.",
    problem: "Manual spreadsheets make operational work difficult to track consistently. Orders, supplier purchases, balances, and sales reporting become fragmented as activity grows.",
    solution: "Built custom CRM and ERM workflows that centralize operational records, automate repeatable processes, and support customer communication.",
    features: [
      "Order tracking workflow",
      "Supplier purchase records",
      "Customer balance sheets",
      "Sales reporting",
      "Automated WhatsApp customer broadcasting",
    ],
    architecture: {
      frontend: "React interface for operational workflows and reporting.",
      backend: "Application logic coordinates CRM and ERM workflows.",
      database: "Firebase stores shared operational records.",
      integrations: ["WhatsApp automation"],
      deployment: "Web application",
    },
    technicalDecisions: "The project prioritizes a small set of connected operational workflows over generic SaaS breadth. Firebase supports shared records while the interface reflects the team's existing operational language.",
    challenges: [
      "Translating manual processes. Spreadsheet habits and stakeholder terminology have to become clear, reusable workflow states.",
      "Keeping records connected. Orders, purchases, balances, and reporting need consistent data relationships to avoid duplicate manual entry.",
    ],
    outcome: [
      "Replaced manual spreadsheets with structured digital workflows.",
      "Implemented automated WhatsApp customer broadcasting.",
      "Mapped stakeholder requirements into modular logic.",
    ],
    metric: "Replaced 3 spreadsheet workflows · WhatsApp broadcasting automated",
    reflection: [
      "Operational software works best when it mirrors how the team already thinks about its work.",
      "Connected records create more value than isolated dashboards.",
      "Automation should remove repetitive coordination without hiding important business state.",
    ],
  },
  {
    id: "financesmith",
    slug: "financesmith",
    title: "FinanceSmith",
    category: "Financial Operations",
    categoryGroup: "CRM / Ops",
    summary: "A finance and operations management platform for educational institutions, centralizing invoices, records, reporting, and operational workflows.",
    role: "Full-Stack Developer",
    status: "Public repository // 2023",
    techStack: ["React", "Node.js", "PDF Automation", "Excel Automation", "Reporting"],
    githubUrl: "https://github.com/ihashirr/financesmith",
    featured: false,
    year: "2023",
    targetUsers: "Finance and operations staff managing institutional records and reports.",
    problem: "Financial and operational records become difficult to reconcile when invoices, reports, and day-to-day workflows are handled across disconnected manual processes.",
    solution: "Developed a centralized platform for financial records, invoices, operational workflows, and generated reports.",
    features: [
      "Centralized invoice records",
      "Financial record management",
      "Operational workflow tracking",
      "PDF report generation",
      "Excel report generation",
    ],
    architecture: {
      frontend: "React interface for finance and operations workflows.",
      backend: "Node.js services handle application logic and report generation.",
      database: "Persistent application storage centralizes financial records.",
      integrations: ["PDF generation", "Excel generation"],
      deployment: "Web application",
    },
    technicalDecisions: "The product centralizes records before adding reporting automation. Keeping document generation within the same workflow reduces manual reconciliation between operational data and exported reports.",
    challenges: [
      "Structuring financial records. Reports are only dependable when the underlying operational entries follow a consistent model.",
      "Generating reusable exports. PDF and Excel output need to remain useful outside the application for existing administrative workflows.",
    ],
    outcome: [
      "Digitized manual finance processes into structured workflows.",
      "Automated PDF and Excel report generation.",
    ],
    metric: "PDF & Excel auto-generated · zero manual export steps",
    reflection: [
      "Reporting quality depends on record quality.",
      "Exports remain important when software is introduced into an existing administrative process.",
      "A finance interface should make record state easy to audit.",
    ],
  },
  {
    id: "traverse",
    slug: "traverse",
    title: "Traverse",
    category: "AI Discovery Platform",
    categoryGroup: "AI",
    summary: "An AI-powered travel discovery platform for personalized destination and restaurant recommendations across the seven Emirates of the UAE.",
    role: "Full-Stack Developer",
    status: "Public repository // 2024",
    techStack: ["TypeScript", "Node.js", "AI", "Behavioral Analytics"],
    githubUrl: "https://github.com/ihashirr/traverse",
    featured: false,
    year: "2024",
    targetUsers: "Travelers discovering destinations and restaurants across the UAE.",
    problem: "Generic travel discovery does not adapt well to individual interests or local context, making it harder for users to find relevant experiences efficiently.",
    solution: "Built a travel discovery platform that uses AI-assisted recommendations and behavioral analytics to personalize destination and restaurant suggestions.",
    features: [
      "Personalized destination recommendations",
      "Restaurant discovery",
      "Coverage across all seven Emirates",
      "Behavioral analytics",
      "AI-assisted recommendation logic",
    ],
    architecture: {
      frontend: "Interactive discovery interface for browsing personalized recommendations.",
      backend: "Node.js services coordinate recommendation requests and application logic.",
      database: "Application storage supports recommendation and behavioral data.",
      integrations: ["AI recommendation logic", "Behavioral analytics"],
      deployment: "Web application",
    },
    technicalDecisions: "The product combines recommendation logic with behavioral signals so discovery can become more relevant over time while remaining focused on a clear regional scope.",
    challenges: [
      "Balancing personalization and clarity. Recommendations need enough context to feel useful without making discovery opaque.",
      "Representing regional coverage. The product has to keep exploration practical across seven distinct Emirates.",
    ],
    outcome: [
      "Built a behavioral analytics and recommendation engine.",
      "Delivered personalized discovery across all seven Emirates of the UAE.",
    ],
    metric: "All 7 Emirates covered · AI-personalized discovery per user",
    reflection: [
      "Recommendation interfaces should explain enough context to earn user trust.",
      "A focused geographic scope makes discovery content easier to structure.",
      "Behavioral signals are most useful when they improve a concrete user decision.",
    ],
  },
  {
    id: "ui-analyzer",
    slug: "ui-analyzer",
    title: "UI Analyzer",
    category: "Design Intelligence",
    categoryGroup: "AI",
    summary: "An AI-powered UI analysis platform that identifies interface components, detects usability weaknesses, and generates actionable recommendations.",
    role: "AI & Automation Developer",
    status: "Public repository // 2024",
    techStack: ["Computer Vision", "Self-Hosted AI", "Automation"],
    githubUrl: "https://github.com/ihashirr/ui-analyzer",
    featured: false,
    year: "2024",
    targetUsers: "Designers and frontend developers reviewing interface quality.",
    problem: "Interface reviews can be slow and inconsistent when teams have to inspect usability weaknesses manually across many screens.",
    solution: "Built an automated UI analysis platform that identifies interface components and produces actionable recommendations using self-hosted AI models.",
    features: [
      "Interface component identification",
      "Usability weakness detection",
      "Actionable UI improvement recommendations",
      "Automated analysis workflow",
      "Self-hosted AI model integration",
    ],
    architecture: {
      frontend: "Analysis interface for submitting and reviewing UI audit results.",
      backend: "Automation pipeline coordinates interface analysis tasks.",
      database: "Application storage retains analysis inputs and generated recommendations.",
      integrations: ["Computer vision", "Self-hosted AI models"],
      deployment: "Web application",
    },
    technicalDecisions: "The project uses self-hosted AI models to keep the analysis workflow under direct control and reduce dependency on third-party inference services.",
    challenges: [
      "Turning visual analysis into useful guidance. Detected interface elements need to map to recommendations that a developer can act on.",
      "Coordinating automated analysis. The workflow has to keep model output structured enough for consistent presentation.",
    ],
    outcome: [
      "Integrated self-hosted AI models without third-party inference dependencies.",
      "Automated UI auditing to accelerate design reviews.",
    ],
    metric: "Self-hosted AI · interface audits automated end-to-end",
    reflection: [
      "AI output becomes valuable when it is translated into specific interface actions.",
      "A controlled inference stack simplifies experimentation with analysis workflows.",
      "Design review tools should support human judgment rather than replace it.",
    ],
  },
]
