"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { DemoSnippet } from "@/data/portfolioData"

export default function CodeSnippetComponent({ snippet }: { snippet: DemoSnippet }) {
  return (
    <SyntaxHighlighter
      language={snippet.language}
      style={oneDark}
      customStyle={{ margin: 0, background: "transparent", padding: "20px 22px" }}
      codeTagProps={{ style: { fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem" } }}
    >
      {snippet.code}
    </SyntaxHighlighter>
  )
}
