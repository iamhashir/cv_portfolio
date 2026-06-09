"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "@phosphor-icons/react"
import styles from "./layout.module.css"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      apply(stored)
      setTheme(stored)
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      apply("light")
      setTheme("light")
    }
  }, [])

  function apply(t: "dark" | "light") {
    if (t === "light") {
      document.documentElement.setAttribute("data-theme", "light")
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
  }

  function toggle() {
    const next = theme === "dark" ? "light" : "dark"
    apply(next)
    setTheme(next)
    localStorage.setItem("theme", next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.themeToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={18} weight="duotone" /> : <Moon size={18} weight="duotone" />}
    </button>
  )
}
