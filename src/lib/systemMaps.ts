export type SystemNode = {
  id: string
  label: string
  x: number
  y: number
}

export type SystemLink = {
  from: string
  to: string
  lane?: "primary" | "secondary"
}

export type SystemMap = {
  title: string
  mode: string
  accent: string
  glow: string
  nodes: SystemNode[]
  links: SystemLink[]
}

export const systemMaps: Record<string, SystemMap> = {
  reactor: {
    title: "Reactor framework runtime",
    mode: "component tree",
    accent: "#d4b896",
    glow: "rgba(212, 184, 150, 0.2)",
    nodes: [
      { id: "jsx", label: "JSX input", x: 16, y: 32 },
      { id: "router", label: "file router", x: 34, y: 54 },
      { id: "hooks", label: "hooks engine", x: 53, y: 28 },
      { id: "scheduler", label: "render scheduler", x: 68, y: 56 },
      { id: "dom", label: "DOM output", x: 84, y: 34 },
    ],
    links: [
      { from: "jsx", to: "router", lane: "primary" },
      { from: "router", to: "hooks", lane: "secondary" },
      { from: "hooks", to: "scheduler", lane: "primary" },
      { from: "scheduler", to: "dom", lane: "primary" },
      { from: "router", to: "scheduler", lane: "secondary" },
    ],
  },
  "mina-games": {
    title: "Realtime multiplayer mesh",
    mode: "socket sessions",
    accent: "#6ee7b7",
    glow: "rgba(110, 231, 183, 0.2)",
    nodes: [
      { id: "player-a", label: "player A", x: 22, y: 27 },
      { id: "player-b", label: "player B", x: 78, y: 25 },
      { id: "gateway", label: "Fastify gateway", x: 50, y: 46 },
      { id: "socket", label: "WebSocket hub", x: 34, y: 70 },
      { id: "prisma", label: "Prisma state", x: 66, y: 72 },
    ],
    links: [
      { from: "player-a", to: "gateway", lane: "primary" },
      { from: "player-b", to: "gateway", lane: "primary" },
      { from: "gateway", to: "socket", lane: "primary" },
      { from: "gateway", to: "prisma", lane: "secondary" },
      { from: "socket", to: "prisma", lane: "secondary" },
    ],
  },
  opsflow: {
    title: "Operations workflow map",
    mode: "records to actions",
    accent: "#c9a96e",
    glow: "rgba(201, 169, 110, 0.22)",
    nodes: [
      { id: "orders", label: "orders", x: 17, y: 28 },
      { id: "crm", label: "CRM logic", x: 38, y: 43 },
      { id: "records", label: "shared records", x: 56, y: 26 },
      { id: "reports", label: "reports", x: 72, y: 49 },
      { id: "whatsapp", label: "WhatsApp alerts", x: 54, y: 74 },
    ],
    links: [
      { from: "orders", to: "crm", lane: "primary" },
      { from: "crm", to: "records", lane: "primary" },
      { from: "records", to: "reports", lane: "primary" },
      { from: "crm", to: "whatsapp", lane: "secondary" },
      { from: "whatsapp", to: "reports", lane: "secondary" },
    ],
  },
  idle: {
    title: "Portfolio systems layer",
    mode: "scroll to activate",
    accent: "#c9a96e",
    glow: "rgba(201, 169, 110, 0.14)",
    nodes: [
      { id: "scope", label: "scope", x: 20, y: 36 },
      { id: "model", label: "data model", x: 38, y: 58 },
      { id: "api", label: "API layer", x: 56, y: 35 },
      { id: "ui", label: "interface", x: 76, y: 57 },
    ],
    links: [
      { from: "scope", to: "model", lane: "primary" },
      { from: "model", to: "api", lane: "primary" },
      { from: "api", to: "ui", lane: "primary" },
      { from: "scope", to: "api", lane: "secondary" },
    ],
  },
}
