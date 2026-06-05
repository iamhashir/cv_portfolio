export const projectCategoryGroups = [
  "CRM / Ops",
  "AI",
  "Realtime",
  "Framework / Systems",
] as const

export type ProjectCategoryGroup = (typeof projectCategoryGroups)[number]

export type WorkflowStep = {
  title: string
  detail: string
  actor: "human" | "system" | "realtime"
}

export type DemoSnippet = {
  label: string
  language: string
  code: string
}

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
  workflow?: WorkflowStep[]
  demoSnippet?: DemoSnippet
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
    metric: "Zero-dependency engine · Built custom JSX routing + state isolation from scratch",
    reflection: [
      "Framework code benefits from a narrow core with explicit lifecycle rules.",
      "Routing and state ownership should be designed together.",
      "Small runtime experiments are useful for understanding the abstractions used by larger libraries.",
    ],
    workflow: [
      { title: "Author Component", detail: "Write JSX syntax — the custom Reactor runtime evaluates it, not React.", actor: "human" },
      { title: "Runtime Resolves", detail: "Engine walks the component tree and calls hook functions in sequence.", actor: "system" },
      { title: "Virtual DOM Built", detail: "A lightweight node tree describes what the UI should look like.", actor: "system" },
      { title: "Diff & Patch", detail: "Only changed nodes are applied to the real DOM — no full re-render.", actor: "system" },
      { title: "State Updates Fire", detail: "Hook state changes trigger targeted re-evaluations, not global reflows.", actor: "system" },
    ],
    demoSnippet: {
      label: "runtime/hooks.ts — custom useState",
      language: "typescript",
      code: `// reactor/src/runtime/hooks.ts
let currentFiber: Fiber | null = null
let hookIndex = 0

export function useState<T>(initial: T): [T, (next: T) => void] {
  const fiber = currentFiber!
  const idx   = hookIndex++

  if (fiber.hooks[idx] === undefined) {
    fiber.hooks[idx] = { value: initial }
  }

  const setState = (next: T) => {
    fiber.hooks[idx].value = next
    scheduleUpdate(fiber)        // queues a re-render for this fiber only
  }

  return [fiber.hooks[idx].value as T, setState]
}

export function withFiber<T>(fiber: Fiber, fn: () => T): T {
  currentFiber = fiber
  hookIndex    = 0
  const result = fn()
  currentFiber = null
  return result
}`,
    },
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
      "Implemented low-latency server-authoritative state synchronization for active multiplayer matches.",
      "Developed a custom JSX-powered lightweight client runtime, eliminating heavy framework overhead.",
      "Coordinated matchmaking queues and tournament brackets handling parallel concurrent sessions.",
    ],
    metric: "Server-authoritative sync · Stable 60 FPS gameplay loops over WebSockets",
    reflection: [
      "Real-time features need clear server and client ownership boundaries.",
      "A multiplayer product benefits from treating infrastructure as part of the user experience.",
      "Shared interfaces reduce coordination cost across a collaborative build.",
    ],
    workflow: [
      { title: "Player Signs In", detail: "JWT session opens; profile, stats, and friend list load from Prisma.", actor: "human" },
      { title: "Joins Match Queue", detail: "Server pairs players by game type — casual match or tournament bracket.", actor: "system" },
      { title: "WebSocket Opens", detail: "Persistent real-time channel connects both clients to the game server.", actor: "system" },
      { title: "Game Runs Live", detail: "Server holds authoritative match state; both clients receive identical frame updates.", actor: "realtime" },
      { title: "Result Recorded", detail: "Match outcome writes to the leaderboard and advances the tournament bracket.", actor: "system" },
    ],
    demoSnippet: {
      label: "game/matchManager.ts — server-authoritative loop",
      language: "typescript",
      code: `// server/src/game/matchManager.ts
type GameState = {
  ball:    { x: number; y: number; vx: number; vy: number }
  paddles: Record<string, number>
  score:   [number, number]
}

function broadcastState(matchId: string, state: GameState) {
  const match = activeMatches.get(matchId)
  if (!match) return

  const payload = JSON.stringify({ type: 'GAME_STATE', ...state })
  for (const client of match.clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload)    // same bytes to every connected client
    }
  }
}

// Game loop — 60 fps, server-side authority
setInterval(() => {
  for (const [id, match] of activeMatches) {
    match.tick()
    broadcastState(id, match.getState())
  }
}, 1000 / 60)`,
    },
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
      "Eliminated fragmented spreadsheet workflows, preventing order tracking leaks and accounting discrepancies.",
      "Built automated WhatsApp integration notifying customers instantly on status updates.",
      "Saved administrative operations time by 15+ hours weekly, centralizing client balances and histories.",
    ],
    metric: "Saved 15+ hours/week · Replaced 3 spreadsheet pipelines with automated CRM + WhatsApp triggers",
    reflection: [
      "Operational software works best when it mirrors how the team already thinks about its work.",
      "Connected records create more value than isolated dashboards.",
      "Automation should remove repetitive coordination without hiding important business state.",
    ],
    workflow: [
      { title: "Customer Orders", detail: "Order placed by phone, message, or in person — staff logs it once.", actor: "human" },
      { title: "Record Created", detail: "System links the order to the customer's balance and purchase history automatically.", actor: "system" },
      { title: "Supplier Tracked", detail: "Purchase entry updates inventory and supplier records in the same workflow.", actor: "system" },
      { title: "Customer Notified", detail: "Automated WhatsApp broadcast fires when order status changes — no manual message.", actor: "system" },
      { title: "Report Live", detail: "Sales totals and balances update in real time. No end-of-week spreadsheet.", actor: "system" },
    ],
    demoSnippet: {
      label: "notifications/whatsapp.js — order broadcast",
      language: "javascript",
      code: `// functions/src/notifications/whatsapp.js
async function sendOrderUpdate(order) {
  const lines = [
    \`*Order Update — #\${order.id}*\`,
    \`Status : \${order.status}\`,
    \`Items  : \${order.items.map(i => i.name).join(', ')}\`,
    \`Total  : AED \${order.total.toFixed(2)}\`,
    order.status === 'ready'
      ? '✅ Ready for collection.'
      : \`⏳ Estimated: \${order.eta}\`,
  ]

  await whatsappClient.sendMessage(
    \`\${order.customer.phone}@c.us\`,
    lines.join('\\n'),
  )

  await db.collection('orders').doc(order.id).update({
    notifiedAt: admin.firestore.Timestamp.now(),
    notificationChannel: 'whatsapp',
  })
}`,
    },
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
      "Eliminated manual invoice entries and spreadsheet reporting, saving 2 full administrative days every month.",
      "Built automated PDF and Excel document generation, completely removing manual formatting and exports.",
      "Designed audit-ready ledgers with automatic validation to prevent multi-entry payment errors.",
    ],
    metric: "Saved 2 days/month · Automated invoice exports & multi-format reports with zero manual entry",
    reflection: [
      "Reporting quality depends on record quality.",
      "Exports remain important when software is introduced into an existing administrative process.",
      "A finance interface should make record state easy to audit.",
    ],
    workflow: [
      { title: "Invoice Arrives", detail: "Finance team receives a supplier or vendor invoice.", actor: "human" },
      { title: "Entered Once", detail: "Single data entry creates the record and links it to the correct ledger.", actor: "human" },
      { title: "System Reconciles", detail: "Platform cross-references entries against existing records and flags discrepancies.", actor: "system" },
      { title: "Generate PDF", detail: "One click produces a formatted report — no manual document assembly.", actor: "system" },
      { title: "Export to Excel", detail: "Structured export ready for external tools and existing administrative processes.", actor: "system" },
    ],
    demoSnippet: {
      label: "reports/generatePDF.js — one-click report",
      language: "javascript",
      code: `// server/src/reports/generatePDF.js
async function generateMonthlyReport(institutionId, month, year) {
  const { rows } = await db.query(
    \`SELECT vendor, amount, date FROM invoices
     WHERE institution_id = $1
       AND date_trunc('month', date) = make_date($2, $3, 1)
     ORDER BY date\`,
    [institutionId, year, month],
  )

  const doc = new PDFDocument({ margin: 50 })
  doc.fontSize(18).font('Helvetica-Bold')
    .text(\`Finance Report — \${month}/\${year}\`)
  doc.moveDown().font('Helvetica').fontSize(11)

  let total = 0
  for (const row of rows) {
    doc.text(\`\${row.vendor.padEnd(32)} AED \${row.amount.toFixed(2)}\`)
    total += parseFloat(row.amount)
  }

  doc.moveDown().font('Helvetica-Bold')
    .text(\`Total  AED \${total.toFixed(2)}\`)

  return doc  // caller: doc.pipe(res) or upload to storage
}`,
    },
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
      "Designed an algorithm tracking real-time user clicks, saves, and dwell times to update travel feeds instantly.",
      "Coordinated travel recommendation mapping covering thousands of local spots across all 7 Emirates.",
      "Enhanced user session times by presenting highly contextual recommendation explanations, building user trust.",
    ],
    metric: "Geo-personalized discovery · Contextual travel recommendations across all 7 Emirates",
    reflection: [
      "Recommendation interfaces should explain enough context to earn user trust.",
      "A focused geographic scope makes discovery content easier to structure.",
      "Behavioral signals are most useful when they improve a concrete user decision.",
    ],
    workflow: [
      { title: "Open Discovery", detail: "User lands on the platform; Emirates destinations and restaurants load immediately.", actor: "human" },
      { title: "Browse & Interact", detail: "Clicks, saves, and dwell time are recorded as behavioural signals.", actor: "human" },
      { title: "AI Processes", detail: "Recommendation engine reweights results based on the user's interaction patterns.", actor: "system" },
      { title: "Feed Personalises", detail: "Discovery updates to surface more relevant destinations for this specific user.", actor: "system" },
      { title: "Builds Over Time", detail: "Saved preferences persist across sessions and grow more accurate with each visit.", actor: "system" },
    ],
    demoSnippet: {
      label: "engine/recommendations.ts — feed refresh",
      language: "typescript",
      code: `// src/engine/recommendations.ts
const WEIGHTS: Record<UserEventType, number> = {
  click: 1, save: 3, dwell_long: 2, dismiss: -2,
}

async function refreshFeed(userId: string, event: UserEvent) {
  const [signals, places] = await Promise.all([
    getUserSignals(userId),
    getPlacesByEmirate(event.emirate),
  ])

  signals.push({
    placeId:  event.placeId,
    category: event.category,
    weight:   WEIGHTS[event.type] ?? 0,
    ts:       Date.now(),
  })

  const ranked = places
    .map(p => ({ ...p, score: computeScore(p, signals) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  await redis.setex(\`feed:\${userId}\`, 3600, JSON.stringify(ranked))
}`,
    },
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
      "Integrated self-hosted visual vision models, removing external API dependencies and keeping customer data private.",
      "Built headless screenshot pipeline capable of scanning live URLs and converting layout issues to code-level issues.",
      "Cut down manual design review time from hours to a few seconds, generating clean markdown audit reports.",
    ],
    metric: "90% QA time reduction · Automated usability visual audit system via self-hosted AI models",
    reflection: [
      "AI output becomes valuable when it is translated into specific interface actions.",
      "A controlled inference stack simplifies experimentation with analysis workflows.",
      "Design review tools should support human judgment rather than replace it.",
    ],
    workflow: [
      { title: "Submit URL", detail: "Paste any live URL into the analysis dashboard.", actor: "human" },
      { title: "Screenshot Captured", detail: "Puppeteer loads and renders the page; image passed to the analysis pipeline.", actor: "system" },
      { title: "Model Analyses", detail: "Self-hosted vision model identifies components, hierarchy, contrast, and layout issues.", actor: "system" },
      { title: "Issues Flagged", detail: "Usability weaknesses listed with type, location, and severity.", actor: "system" },
      { title: "Recommendations Out", detail: "Each issue gets a specific, actionable fix — precise enough to implement immediately.", actor: "system" },
    ],
    demoSnippet: {
      label: "analyzer/pipeline.py — audit pipeline",
      language: "python",
      code: `# analyzer/pipeline.py
async def analyze_url(url: str) -> AuditReport:
    # 1. Headless browser captures a full-page screenshot
    screenshot = await capture_screenshot(url)

    # 2. Self-hosted vision model runs — no third-party inference
    raw = await vision_model.analyze(
        image=screenshot,
        prompt=AUDIT_SYSTEM_PROMPT,
    )

    # 3. Parse into structured Issue objects
    issues = [
        Issue(
            type=item["type"],
            severity=item["severity"],
            element=item["selector"],
            detail=item["description"],
            fix=item["recommendation"],
        )
        for item in raw["findings"]
    ]

    return AuditReport(
        url=url,
        score=compute_score(issues),
        issues=sorted(issues, key=lambda i: SEVERITY_ORDER[i.severity]),
        captured_at=datetime.utcnow(),
    )`,
    },
  },
]
