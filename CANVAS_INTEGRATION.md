# Canvas Animation Component Integration Guide

## ✅ Setup Complete

Your codebase is now configured with all necessary dependencies for the canvas animation component.

### What Was Installed

**Components Created:**
- `/src/components/ui/canvas.tsx` - Core canvas animation engine
- `/src/components/ui/button.tsx` - Shadcn button component
- `/src/components/ui/canvas-hero.tsx` - Complete hero section using canvas
- `/src/lib/utils.ts` - Utility functions (cn helper)

**Dependencies Added:**
- `@radix-ui/react-slot` - Required by shadcn/ui components
- `class-variance-authority` - Utility for managing component variants
- `clsx` - Classname utility
- `tailwind-merge` - Tailwind CSS class merging utility

### Project Structure

Your project now supports the shadcn/ui component pattern:
```
src/
├── components/
│   ├── ui/                          (← New folder for shadcn components)
│   │   ├── canvas.tsx               (Canvas animation engine)
│   │   ├── button.tsx               (Shadcn button)
│   │   ├── canvas-hero.tsx          (Canvas hero section)
│   │   └── ...other ui components
│   ├── PortfolioShell.tsx
│   └── ...other custom components
├── lib/
│   └── utils.ts                     (← New file with cn utility)
└── ...
```

## Using the Canvas Hero Component

### Option 1: Replace Current Home Page

In your `src/app/page.tsx`, you can replace the current hero with:

```tsx
"use client"

import { CanvasHero } from "@/components/ui/canvas-hero"

export default function Home() {
  return (
    <>
      <CanvasHero />
      {/* Rest of your page content below */}
    </>
  )
}
```

### Option 2: Keep Current Hero + Add Canvas Section

If you want to keep the shape landing hero and add this as an alternate section:

```tsx
import { CanvasHero } from "@/components/ui/canvas-hero"
import { Home as ShapeLandingHero } from "@/app/page" // Your current hero

export default function Home() {
  return (
    <>
      {/* Your current beautiful shape hero */}
      <ShapeLandingHero />
      
      {/* Canvas hero section */}
      <CanvasHero />
      
      {/* Rest of content */}
    </>
  )
}
```

## Component Features

### Canvas Animation
- **Mouse tracking**: Particles follow your cursor smoothly
- **Touch support**: Works on mobile/tablet
- **Performance**: Pure canvas rendering (60fps+)
- **Responsive**: Auto-resizes to window dimensions
- **Color cycling**: Hue shifts dynamically (rainbow effect)

### Configuration Options

Edit `/src/components/ui/canvas.tsx` to customize:

```tsx
E = {
  debug: true,           // Set to false in production
  friction: 0.5,         // Higher = slower particle decay (0.3-0.8)
  trails: 80,            // More trails = more dense effect (20-150)
  size: 50,              // Particle trail segments (30-100)
  dampening: 0.025,      // Smoothing factor (0.01-0.1)
  tension: 0.99,         // Spring tension (0.9-0.99)
}
```

## Performance Notes

✅ **Optimized for:**
- Desktop (0-2K monitors)
- Tablet (iPad Pro, etc.)
- Mobile (optimization included)

⚡ **Performance characteristics:**
- 80 trails × 50 segments = ~4000 particles max
- Canvas clears every frame (no memory leak)
- Uses `requestAnimationFrame` for 60fps
- Pauses when window loses focus (saves battery)

## Testing the Component

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to home** and move your mouse across the canvas
3. **Test responsiveness** by resizing your browser
4. **Test mobile** using Chrome DevTools mobile emulation

## Next Steps

1. **Decide on placement**: Replace current hero or add as a section?
2. **Test performance** on your target devices
3. **Customize colors** if desired (edit the `hsla()` value in `render()`)
4. **Fine-tune particle density** using the `E` config object

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Canvas not appearing | Check browser console for errors, ensure `id="canvas"` exists |
| Particles not smooth | Increase `friction` (0.6-0.8) or decrease `trails` count |
| Performance lag | Reduce `trails` (40-60) or `size` (30-40) |
| Mobile not working | Ensure touch events are enabled, check viewport meta tag |

## Architecture Note

This component follows shadcn/ui conventions:
- All UI components go in `/src/components/ui/`
- Utility functions go in `/src/lib/utils.ts`
- Use the `cn()` helper for merging Tailwind classes
- Button variants use `class-variance-authority` for consistency

You can now add more shadcn/ui components easily using the `npx shadcn-ui@latest add <component>` CLI command.
