'use client'

export function PortfolioFrame() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: '10px',
        border: '1px solid rgba(24,24,27,0.1)',
        borderRadius: '18px',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
