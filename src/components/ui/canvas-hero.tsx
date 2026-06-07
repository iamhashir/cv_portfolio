"use client"

import { useEffect } from "react"
import Link from "next/link"
import { renderCanvas } from "@/components/ui/canvas"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CanvasHero() {
  useEffect(() => {
    renderCanvas()
  }, [])

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-[#030303]">
      <div className="animation-delay-8 animate-fadeIn relative z-10 mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20">
        {/* Badge */}
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs leading-6 text-white/60">
            <span className="mr-2">✨</span>
            Interactive Canvas Animation
            <Link
              href="#"
              className="hover:text-amber-500 ml-1 flex items-center font-semibold transition-colors"
            >
              <div className="absolute inset-0 flex" aria-hidden="true" />
              Explore
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-10 mt-4 md:mt-6">
          <div className="px-2">
            <div className="relative mx-auto h-full max-w-4xl border border-white/10 bg-white/5 backdrop-blur-md p-6 rounded-lg [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight text-white md:flex-col md:text-7xl">
                Interactive Motion Canvas
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <p className="text-xs text-emerald-500">Performance Optimized</p>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-2xl text-white md:text-2xl">
            Move your mouse across the canvas
          </h2>

          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-white/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            Experience smooth, flowing motion particles that follow your cursor. Built with pure canvas for maximum performance.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/work">
              <Button variant="default" size="lg" className="bg-amber-600 hover:bg-amber-700">
                View Work <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="mailto:magnotekbyasool@gmail.com">
              <Button variant="outline" size="lg" className="border-white/20 hover:border-amber-600">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Canvas Background */}
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      />
    </section>
  )
}
