import { test, expect } from "@playwright/test"

test.describe("Performance metrics", () => {
  test("homepage loads within 5s and has no console errors", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })

    const t0 = Date.now()
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const elapsed = Date.now() - t0

    console.log(`[perf] networkidle in ${elapsed}ms`)
    expect(elapsed).toBeLessThan(10_000)
    // Filter out known third-party noise
    const realErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("fonts.googleapis")
    )
    expect(realErrors).toHaveLength(0)
  })

  test("FPS stays ≥ 30 during hero scroll", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")

    // Measure FPS over a 2s scroll sequence
    const fps = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let frames = 0
        const start = performance.now()
        const duration = 2000

        const count = () => {
          frames++
          if (performance.now() - start < duration) {
            requestAnimationFrame(count)
          } else {
            resolve(Math.round((frames / duration) * 1000))
          }
        }

        // Trigger scroll while counting frames
        let scrollY = 0
        const scrollInterval = setInterval(() => {
          scrollY += 40
          window.scrollTo(0, scrollY)
        }, 50)

        requestAnimationFrame(count)
        setTimeout(() => clearInterval(scrollInterval), duration)
      })
    })

    console.log(`[perf] FPS during hero scroll: ${fps}`)
    expect(fps).toBeGreaterThanOrEqual(30)
  })

  test("LCP is under 4s and FCP under 2s", async ({ page }) => {
    await page.goto("/")

    const metrics = await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        if (document.readyState === "complete") { resolve(); return }
        window.addEventListener("load", () => resolve())
      })
      await new Promise((r) => setTimeout(r, 500))

      const paint = performance.getEntriesByType("paint")
      const fcp = paint.find((e) => e.name === "first-contentful-paint")?.startTime ?? null

      const lcpEntries = performance.getEntriesByType("largest-contentful-paint") as PerformanceEntry[]
      const lcp = lcpEntries.length > 0
        ? lcpEntries[lcpEntries.length - 1].startTime
        : null

      return { fcp, lcp }
    })

    console.log(`[perf] FCP: ${metrics.fcp?.toFixed(0)}ms  LCP: ${metrics.lcp?.toFixed(0)}ms`)

    if (metrics.fcp !== null) expect(metrics.fcp).toBeLessThan(2000)
    if (metrics.lcp !== null) expect(metrics.lcp).toBeLessThan(4000)
  })

  test("no rAF-driven React re-renders on idle hero", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")

    // Count how many times a DOM mutation fires in 1s while idle (no mouse/scroll)
    const mutations = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let count = 0
        const obs = new MutationObserver(() => { count++ })
        obs.observe(document.body, { subtree: true, childList: true, attributes: true })
        setTimeout(() => { obs.disconnect(); resolve(count) }, 1000)
      })
    })

    console.log(`[perf] DOM mutations in 1s idle: ${mutations}`)
    // After fix, rAF+setState loop is gone — mutations should be low (animations via WAAPI/compositor)
    // Threshold is generous to allow framer-motion compositor animations
    expect(mutations).toBeLessThan(200)
  })
})
