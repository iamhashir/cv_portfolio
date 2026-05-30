import React from "react"

interface ArchitectureDiagramProps {
  slug: string
  className?: string
}

export function ArchitectureDiagram({ slug, className }: ArchitectureDiagramProps) {
  switch (slug) {
    case "opsflow":
      return (
        <svg className={className} width="720" height="300" viewBox="0 0 720 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Grid Lines */}
          <path d="M 0 50 L 720 50 M 0 150 L 720 150 M 0 250 L 720 250" stroke="#1e2530" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 120 0 L 120 300 M 360 0 L 360 300 M 600 0 L 600 300" stroke="#1e2530" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Flow arrows */}
          <path d="M 190 100 L 290 100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="1 1" />
          <path d="M 430 100 L 530 100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 360 140 L 360 190" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 360 220 L 530 220" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 4" />

          {/* SVG Markers */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* Nodes */}
          {/* Column 1: Client Layers */}
          <rect x="20" y="60" width="170" height="80" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="35" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">React UI Dashboard</text>
          <text x="35" y="115" fill="#64748b" fontSize="11" fontFamily="var(--font-mono)">Ops &amp; Warehouse views</text>

          {/* Column 2: Backend API Router */}
          <rect x="290" y="60" width="140" height="80" rx="8" fill="#191d26" stroke="#818cf8" strokeWidth="1.5" />
          <text x="310" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Node.js API</text>
          <text x="310" y="115" fill="#c7d2fe" fontSize="11" fontFamily="var(--font-mono)">Express Gateway</text>

          {/* Column 3: Storage Clusters */}
          <rect x="530" y="60" width="170" height="80" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="545" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Firebase Firestore</text>
          <text x="545" y="115" fill="#10b981" fontSize="11" fontFamily="var(--font-mono)">Real-time sync ledger</text>

          {/* Down Column 2: Integrations */}
          <rect x="290" y="190" width="140" height="60" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="305" y="215" fill="#f1f5f9" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">WhatsApp Gateway</text>
          <text x="305" y="235" fill="#64748b" fontSize="10" fontFamily="var(--font-mono)">Twilio Business API</text>

          {/* Column 3 Down: Customer alerts */}
          <rect x="530" y="190" width="170" height="60" rx="8" fill="#0b0d12" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="545" y="215" fill="#10b981" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">Client Notification</text>
          <text x="545" y="235" fill="#64748b" fontSize="10" fontFamily="var(--font-mono)">SMS / Text Broadcasts</text>
        </svg>
      )
    case "financesmith":
      return (
        <svg className={className} width="720" height="300" viewBox="0 0 720 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 50 L 720 50 M 0 150 L 720 150 M 0 250 L 720 250" stroke="#1e232d" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 120 0 L 120 300 M 360 0 L 360 300 M 600 0 L 600 300" stroke="#1e232d" strokeWidth="1" strokeDasharray="4 4" />
          
          <path d="M 190 100 L 290 100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 430 100 L 530 100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 360 140 L 360 190" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
          
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* Nodes */}
          <rect x="20" y="60" width="170" height="80" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="35" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Invoice PDF Upload</text>
          <text x="35" y="115" fill="#64748b" fontSize="11" fontFamily="var(--font-mono)">Ops / Finance Team</text>

          <rect x="290" y="60" width="140" height="80" rx="8" fill="#191d26" stroke="#818cf8" strokeWidth="1.5" />
          <text x="305" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Redis Queue</text>
          <text x="305" y="115" fill="#c7d2fe" fontSize="11" fontFamily="var(--font-mono)">Task ingestion</text>

          <rect x="530" y="60" width="170" height="80" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="545" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">FastAPI Worker</text>
          <text x="545" y="115" fill="#f59e0b" fontSize="11" fontFamily="var(--font-mono)">Async OCR extraction</text>

          <rect x="290" y="190" width="140" height="60" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="305" y="215" fill="#f1f5f9" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">Prisma Database</text>
          <text x="305" y="235" fill="#64748b" fontSize="10" fontFamily="var(--font-mono)">PostgreSQL Ledger</text>
        </svg>
      )
    case "ui-analyzer":
      return (
        <svg className={className} width="720" height="300" viewBox="0 0 720 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 50 L 720 50 M 0 150 L 720 150 M 0 250 L 720 250" stroke="#1e232d" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 120 0 L 120 300 M 360 0 L 360 300 M 600 0 L 600 300" stroke="#1e232d" strokeWidth="1" strokeDasharray="4 4" />
          
          <path d="M 190 100 L 290 100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 430 100 L 530 100" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 360 140 L 360 190" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* Nodes */}
          <rect x="20" y="60" width="170" height="80" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="35" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">URL / Screenshot Input</text>
          <text x="35" y="115" fill="#64748b" fontSize="11" fontFamily="var(--font-mono)">Auditor Dashboard</text>

          <rect x="290" y="60" width="140" height="80" rx="8" fill="#191d26" stroke="#818cf8" strokeWidth="1.5" />
          <text x="305" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">FastAPI Engine</text>
          <text x="305" y="115" fill="#c7d2fe" fontSize="11" fontFamily="var(--font-mono)">Puppeteer Screenshot</text>

          <rect x="530" y="60" width="170" height="80" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="545" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">OpenAI Vision</text>
          <text x="545" y="115" fill="#10b981" fontSize="11" fontFamily="var(--font-mono)">Accessibility Auditor</text>

          <rect x="290" y="190" width="140" height="60" rx="8" fill="#12151c" stroke="#1e232d" strokeWidth="1.5" />
          <text x="305" y="215" fill="#f1f5f9" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">Supabase Backend</text>
          <text x="305" y="235" fill="#64748b" fontSize="10" fontFamily="var(--font-mono)">PostgreSQL &amp; Storage</text>
        </svg>
      )
    default:
      return (
        <svg className={className} width="720" height="200" viewBox="0 0 720 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 L 720 100" stroke="#1e232d" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 360 0 L 360 200" stroke="#1e232d" strokeWidth="1" strokeDasharray="4 4" />
          <rect x="260" y="60" width="200" height="80" rx="8" fill="#191d26" stroke="#818cf8" strokeWidth="1.5" />
          <text x="280" y="95" fill="#f1f5f9" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Standard Web Node</text>
          <text x="280" y="115" fill="#64748b" fontSize="11" fontFamily="var(--font-mono)">Next.js App Server</text>
        </svg>
      )
  }
}
