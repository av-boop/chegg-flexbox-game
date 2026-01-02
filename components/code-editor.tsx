"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  onCheck: () => void
  isCorrect: boolean
  targetSelector: string
}

export function CodeEditor({ value, onChange, onCheck, isCorrect, targetSelector }: CodeEditorProps) {
  const [lineNumbers] = useState(Array.from({ length: 10 }, (_, i) => i + 1))

  return (
    <div className="space-y-4">
      <div className="bg-muted rounded-lg overflow-hidden">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-muted-foreground/10 px-3 py-4 text-sm text-muted-foreground font-mono">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-6">
                {num}
              </div>
            ))}
          </div>

          {/* Code Area */}
          <div className="flex-1 p-4">
            <div className="font-mono text-sm space-y-1">
              <div className="text-muted-foreground">
                <span className="text-primary">{targetSelector}</span> {"{"}
              </div>
              <div className="text-muted-foreground ml-4">display: flex;</div>
              <div className="ml-4">
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="/* Your CSS here */"
                  className="w-full bg-transparent border-none outline-none resize-none text-primary font-mono"
                  rows={3}
                  style={{ minHeight: "72px" }}
                />
              </div>
              <div className="text-muted-foreground">{"}"}</div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={onCheck} className="w-full" variant="secondary">
        <Play className="w-4 h-4 mr-2" />
        Check Solution
      </Button>
    </div>
  )
}
