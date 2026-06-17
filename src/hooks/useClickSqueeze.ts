import { useEffect } from 'react'

export function useClickSqueeze() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Skip if it's a text node or non-interactive element
      if (!target || target.nodeType === Node.TEXT_NODE) return

      // Check if it's an interactive element or has interactive parent
      const isInteractive =
        target.matches('button, a, input, [role="button"], [role="link"], .btn-primary, .btn-secondary') ||
        target.closest('button, a, input, [role="button"], [role="link"], .btn-primary, .btn-secondary')

      if (!isInteractive) return

      const element = target.matches('button, a, input, [role="button"], [role="link"], .btn-primary, .btn-secondary')
        ? target
        : target.closest('button, a, input, [role="button"], [role="link"], .btn-primary, .btn-secondary') as HTMLElement

      if (!element) return

      // Create ripple effect with squeeze animation
      element.style.animation = 'none'
      // Trigger reflow to restart animation
      void element.offsetWidth
      element.style.animation = 'clickSqueeze 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])
}
