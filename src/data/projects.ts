export type Project = {
  title: string
  slug: string
  summary: string
  role: string
  status: string
  category: string
  featured: boolean
  stack: string[]
  problem: string
  solution: string
  features: string[]
  architecture: {
    frontend: string
    backend: string
    database: string
    integrations?: string[]
    deployment?: string
  }
  challenges: string[]
  outcome: string[]
  reflection: string[]
}

export const projects: Project[] = [
  {
    title: "OpsFlow",
    slug: "opsflow",
    summary: "Business operations automation platform replacing manual spreadsheet-based tracking with custom CRM workflows and unified reporting.",
    role: "Lead Full-Stack Developer",
    status: "Private deployment / Case study available on request",
    category: "CRM / Ops",
    featured: true,
    stack: ["React", "Firebase", "Node.js", "Express", "Prisma", "TypeScript"],
    problem: "A growing operations business was managing orders, supplier purchases, and customer accounts manually across fragmented spreadsheets and chat groups. This resulted in lost orders, delayed customer status updates, mismatching balances, and zero visibility into historical analytics or cash flow trends.",
    solution: "Designed and engineered an integrated business operations automation platform. Built custom modules for order tracking, supplier purchase logging, balance sheet calculations, and an automated customer notification system to unify operational workflows.",
    features: [
      "Real-time order lifecycle tracking and custom status pipelines",
      "Supplier purchase logging and automated inventory ledger integration",
      "Dynamic customer balance sheets reflecting transactions and payments",
      "Automated communication templates utilizing WhatsApp Business API",
      "Role-based administrative dashboards for executives and warehouse operators"
    ],
    architecture: {
      frontend: "React SPA with React Router, context-based state management, and custom UI components",
      backend: "Node.js API powered by Express and structured routes",
      database: "Firebase Firestore for real-time synchronization with Prisma client running on relational secondary nodes",
      integrations: ["WhatsApp Business API (Twilio)", "PDF/Excel export utility engines", "Stripe payment checkpoints"],
      deployment: "Vercel (Frontend) and Google Cloud Run (Backend services)"
    },
    challenges: [
      "Handling frequently changing client operations mid-development. Solved by implementing a schema-less key-value attributes extension on the core order model, enabling operations staff to create custom fields dynamically.",
      "Ensuring sub-second search latency over thousands of historical text entries. Developed a localized index mirroring script that caches text records inside a search indexing utility, keeping UI search quick and fluid."
    ],
    outcome: [
      "Reduced manual administrative overhead by approximately 60% within the first month",
      "Completely eliminated order misplacement and duplicate purchase records",
      "Centralized legacy audit files into an instantly searchable transaction record library",
      "Enabled real-time cash flow visibility, helping stakeholders make faster purchasing decisions"
    ],
    reflection: [
      "Underlining modularity early in development saved significant refactoring time when custom reporting was requested.",
      "Real-time syncing layers require defensive error-handling to prevent race conditions during concurrent edits.",
      "Deep understanding of how operators work in warehouses is key to creating intuitive layout interfaces."
    ]
  },
  {
    title: "FinanceSmith",
    slug: "financesmith",
    summary: "Finance workflow platform enabling automated payment approvals, cost tracking, and real-time ledger auditing for operations teams.",
    role: "Full-Stack Engineer",
    status: "Private Case Study",
    category: "Framework / Systems",
    featured: true,
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Fastify"],
    problem: "An operations team struggled with fragmented, manual expense requests. Multi-step approval workflows were conducted entirely over email, and tracking department-wise budgets required manual reconciliation into disconnected spreadsheets, resulting in audit delays and budget leakage.",
    solution: "Engineered a centralized finance workflow platform featuring automated hierarchical approval routing, real-time cost-to-budget tracking, and a double-entry ledger engine that provides an immutable audit trail.",
    features: [
      "Custom hierarchical approval routes based on expense limit thresholds",
      "Interactive budget tracking charts reporting division-wise expenditures",
      "Double-entry bookkeeping engine ensuring ledger compliance",
      "Asynchronous document parsing queues extracting text from invoices",
      "Comprehensive CSV/Excel export tools for Direct Bank Reconciliation"
    ],
    architecture: {
      frontend: "Next.js UI utilizing TypeScript interfaces and styled React wrappers",
      backend: "Fastify microservices optimizing high-frequency transactional routes",
      database: "PostgreSQL database running with Prisma ORM for type-safe query compilation",
      integrations: ["OCR Document Analysis API", "Secure AWS S3 Bucket storage", "Slack App Webhooks"],
      deployment: "AWS ECS Fargate running Dockerized containers"
    },
    challenges: [
      "Preventing double-charge race conditions during concurrent payment runs. Mitigated by implementing database-level row locks and database transactions, guaranteeing operations are executed atomically.",
      "High latency during OCR invoice ingestion. Designed a background worker queue using a Redis backing store, decoupling file upload from document analysis to keep the main thread responsive."
    ],
    outcome: [
      "Reduced the invoice-to-ledger cycle from 5 operational days to under 4 hours",
      "Provided 100% auditable invoice logs for managers, completely stopping unauthorized expense requests",
      "Saved the bookkeeping team hours of manual data alignment and entry work"
    ],
    reflection: [
      "Immutable databases simplify audit log engineering, though they require strict error checking during creation.",
      "Offloading complex tasks to background processes is essential to maintaining high UI performance.",
      "Standardizing validation on both client and server prevents bad data from corrupting ledger logs."
    ]
  },
  {
    title: "UI Analyzer",
    slug: "ui-analyzer",
    summary: "An AI-powered design auditing tool that scans interfaces for accessibility, heuristics, and consistency issues using computer vision.",
    role: "AI & Full-Stack Developer",
    status: "Public beta / Live demo available",
    category: "AI",
    featured: true,
    stack: ["Next.js", "Python", "FastAPI", "OpenAI Vision API", "Supabase", "TypeScript"],
    problem: "Design reviews are slow, inconsistent, and highly subjective. Product and development teams struggle to identify layout misalignments, text scaling violations, and accessibility failures (WCAG) before shipping, leading to design debt.",
    solution: "Created a visual AI-assisted auditing web app that accepts screenshot uploads or target URLs, executes heuristic layout checks, and displays design violations on an interactive overlay.",
    features: [
      "AI-powered screenshot scanner powered by OpenAI Vision LLMs",
      "Automated WCAG AA/AAA color contrast audit calculator",
      "Interactive pixel-level canvas grid indicating alignment issues",
      "Shareable report generator compiling heuristical feedback with PDF options",
      "Custom REST endpoint for automated CI/CD pipeline UI checks"
    ],
    architecture: {
      frontend: "Next.js App Router with canvas drawing overlays and visual coordinates",
      backend: "FastAPI server running Python processing scripts and computer vision utilities",
      database: "Supabase PostgreSQL database and Storage buckets for uploaded assets",
      integrations: ["OpenAI Vision API API", "Puppeteer headless browser for remote page screenshot extraction", "GitHub REST API"],
      deployment: "Vercel (Frontend) and Railway (Python server)"
    },
    challenges: [
      "Scaling coordinates accurately across different viewport aspect ratios. Resolved by normalizing absolute coordinates into relative percentages, rendering bounding highlights correctly on all devices.",
      "Mitigating the 8+ second latency of OpenAI Vision models. Created a real-time progress update screen using Server-Sent Events (SSE) that feeds users immediate analytical feedback as it evaluates."
    ],
    outcome: [
      "Allowed QA teams to capture 85% of standard visual alignment issues before manual reviews",
      "Replaced manual audit documents with single, shareable web dashboard links",
      "Accelerated front-end design system conformance validation cycles"
    ],
    reflection: [
      "Using Server-Sent Events is highly effective for keeping users engaged during slow AI model runs.",
      "Normalizing visual data is critical when building interactive web overlays.",
      "Keeping python microservices separate from the frontend allows scaling CPU-heavy image processing independently."
    ]
  },
  {
    title: "Traverse",
    slug: "traverse",
    summary: "A real-time travel recommendation and analytics platform that matches travelers with local experiences using collaborative filtering.",
    role: "Backend & Data Architect",
    status: "Private deployment",
    category: "Realtime",
    featured: false,
    stack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Redis", "Python"],
    problem: "Travel coordinators were manually tailoring trip plans, which was slow and lacked personalization based on real-time feedback. Booking systems lacked user data analysis, resulting in lower conversion on local excursion upsells.",
    solution: "Developed an analytical recommendation engine leveraging a collaborative filtering model, caching structures, and a mapping interface to deliver responsive trip suggestions.",
    features: [
      "Real-time travel itinerary generation utilizing preference tags",
      "Collaborative filtering model matching users with highly rated activities",
      "Low-latency analytics dashboard tracking experience bookings",
      "Dynamic trip mapper featuring path optimization coordinates"
    ],
    architecture: {
      frontend: "Next.js UI with custom mapping integrations",
      backend: "Node.js API + Python Flask analytics engine",
      database: "MongoDB document storage with Redis caching layers",
      integrations: ["Google Places API", "Mapbox Routing API", "Mixpanel Events Tracking"],
      deployment: "Vercel and AWS DocumentDB"
    },
    challenges: [
      "High query latency when executing travel recommendation calculations. Solved by caching core itinerary fragments in Redis, reducing query response times by over 80%.",
      "Formatting complex geographical coordinate maps. Implemented MongoDB geospatial index queries, allowing sub-second distance and radius lookups."
    ],
    outcome: [
      "Increased excursions and local experience booking rates by 45%",
      "Reduced itinerary design cycles from hours to seconds for operators",
      "Provided operators with real-time dashboards mapping popular travel zones"
    ],
    reflection: [
      "Caching static dataset sections in memory dramatically lowers database pressure.",
      "Geospatial databases make working with coordinates significantly easier than custom mathematical formulas.",
      "Interactive maps improve visitor session durations when planning workflows."
    ]
  },
  {
    title: "Reactor",
    slug: "reactor",
    summary: "A visual state machine builder and generator for complex frontends, compiling nodes into type-safe code controllers.",
    role: "Lead Systems Architect",
    status: "Open Source / Public Repo",
    category: "Framework / Systems",
    featured: false,
    stack: ["React", "TypeScript", "Web Audio API", "Rust", "WebAssembly", "CSS Modules"],
    problem: "Debugging complex application state in large frontends is slow and error-prone. Asynchronous event loops and multiple page variables frequently trigger race conditions and unexpected layout glitches.",
    solution: "Created an interactive node-based canvas designer that visually maps frontend transitions, analyzes them for logic deadlocks, and outputs fully typed React hook controllers.",
    features: [
      "Drag-and-drop node state machine designer",
      "TypeScript code generator producing clean state hooks",
      "Time-travel debugger tracking state changes in a timeline",
      "Rust-powered cycle checker identifying deadlock nodes in graphs",
      "Graph layout auto-organizer utilizing WebAssembly graph-sorting scripts"
    ],
    architecture: {
      frontend: "React canvas client with specialized drag-and-drop engines and context state managers",
      backend: "Wasm compiler compiling native Rust functions for layout sorting",
      database: "File-system export schema / local browser storage database",
      integrations: ["GitHub Gist API", "NPM Registry linking hooks"],
      deployment: "Vercel / GitHub Pages hosting"
    },
    challenges: [
      "UI lag when panning layouts containing hundreds of nodes. Resolved by offloading node rendering to custom HTML5 canvases, bypassing React DOM updates during movement.",
      "Structuring a clean, human-readable TypeScript output schema. Engineered an AST (Abstract Syntax Tree) compiler in Rust that parses graphic nodes into structured code loops."
    ],
    outcome: [
      "Adopted by several teams to design complex checkout and chat flow interfaces",
      "Reduced frontend state debugging durations by mapping out state transitions beforehand",
      "Provided an open-source tool for frontend developers managing complex web variables"
    ],
    reflection: [
      "Offloading complex calculations to Rust and WebAssembly makes web apps feel like native software.",
      "Canvas renders outperform standard React rendering loop frameworks for highly populated node graphs.",
      "Compiling graphical models to clean code bridges the gap between design and code."
    ]
  },
  {
    title: "MINA GAMES",
    slug: "mina-games",
    summary: "A real-time multiplayer gaming hub that handles match coordination, live leaderboards, and instant messaging overlays.",
    role: "Lead Developer",
    status: "Active MVP / Live Demo",
    category: "Realtime",
    featured: false,
    stack: ["Next.js", "Node.js", "Socket.io", "Redis", "SQLite", "Firebase"],
    problem: "Many browser-based multiplayer games experience high connection latency, rendering issues, and server lag. Syncing game loops and handling sudden player disconnections without database crashes is highly complex.",
    solution: "Developed a real-time gaming hub using persistent web socket channels, Redis message pub/sub, and localized SQLite nodes to achieve low match latency and resilient user sessions.",
    features: [
      "Low-latency matchmaking queue using player ratings",
      "Socket.io communication sync engine syncing game state",
      "Dynamic leaderboards recalculating scores instantly",
      "Integrated live chat channels with online indicators",
      "Optimized mobile-responsive client interfaces supporting gestures"
    ],
    architecture: {
      frontend: "React client rendering optimized game layouts",
      backend: "Node.js server cluster managing WebSockets",
      database: "SQLite database for profiles and Redis cache storing matchmaking queues",
      integrations: ["Firebase Authentication", "Discord status webhooks"],
      deployment: "DigitalOcean Droplets with Cloudflare security routing"
    },
    challenges: [
      "Handling connection dropouts without losing player match states. Solved by storing active session variables in Redis, enabling reconnection reconnects within a 60-second window.",
      "Maintaining physics rendering synchronization at 60 frames per second. Implemented client-side input prediction and server reconciliation patterns to eliminate perceived latency."
    ],
    outcome: [
      "Achieved sub-50ms sync latencies across regional multiplayer sessions",
      "Successfully scaled to manage concurrent players on single core virtual server nodes",
      "Boosted average gameplay session durations by providing instant match lobbies"
    ],
    reflection: [
      "Client-side prediction is essential for creating real-time experiences over sockets.",
      "Redis is an exceptional, fast-access tool for managing short-lived sessions and state queues.",
      "Keeping connection logs separate from profile data prevents database performance bottlenecks."
    ]
  }
]
