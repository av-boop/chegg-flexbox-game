"use client"

import { useMemo, useEffect, useState } from "react"
import type { Level } from "@/lib/levels"
// Valid CSS values for flexbox properties
const validCSSValues: Record<string, string[]> = {
  'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
  'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'align-content': ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'],
}
// Check if CSS value is valid for the property
const isValidCSSValue = (property: string, value: string): boolean => {
  const validValues = validCSSValues[property.toLowerCase()]
  if (!validValues) return true // Allow unknown properties
  return validValues.includes(value.toLowerCase())
}

interface EmojiVisualizationProps {
  level: Level
  userCode: string
  isCorrect: boolean
}

const convertCSSPropertyName = (property: string): string => {
  return property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

export function PondVisualization({ level, userCode, isCorrect }: EmojiVisualizationProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (isCorrect) {
      setShowSuccess(true)
    }
  }, [isCorrect])

  useEffect(() => {
    setShowSuccess(false)
  }, [level.id, userCode])

  const appliedStyles = useMemo(() => {
    if (!userCode.trim()) return {}

    try {
      // Parse CSS properties from user code
      const styles: Record<string, string> = {}
      const lines = userCode.split("\n")

      lines.forEach((line) => {
        const match = line.match(/^\s*([a-z-]+)\s*:\s*([^;]+);?\s*$/i)
        if (match) {
          const [, property, value] = match
          if (!trimmedValue || !isValidCSSValue(property, trimmedValue)) {    
           return   
            }
          const trimmedValue = value.trim()
          if (trimmedValue) {
            const camelCaseProperty = convertCSSPropertyName(property.trim())
            styles[camelCaseProperty] = trimmedValue
          }
        }
      })

      return styles
    } catch {
      return {}
    }
  }, [userCode])

  const getInitialContainerStyle = () => {
    const baseStyle = {
      display: "flex",
      minHeight: "350px", // Ensures vertical alignment properties work
      width: "100%",
    }

    // Level 3 should start centered to make flex-start meaningful
    if (level.id === 3) {
      return { ...baseStyle, justifyContent: "center" }
    }

    if (level.id === 9) {
      return {
        ...baseStyle,
        minHeight: "450px",
        alignContent: "flex-start",
      }
    }

    if (level.id === 10 || level.id === 11) {
      return {
        ...baseStyle,
        flexWrap: "nowrap",
        gap: "8px",
        minHeight: "450px",
        alignContent: "flex-start",
      }
    }

    return baseStyle
  }

  const containerStyle = {
    ...getInitialContainerStyle(),
    ...appliedStyles,
  }

  const getStudentStyles = (studentIndex: number) => {
    if (!userCode.trim()) return {}

    const styles: Record<string, string> = {}
    const lines = userCode.split("\n")

    lines.forEach((line) => {
      const match = line.match(/^\s*([a-z-]+)\s*:\s*([^;]+);?\s*$/i)
      if (match) {
        const [, property, value] = match

        if (level.id === 12) {
          if (level.targetSelector === ".student") {
            const trimmedValue = value.trim()
            if (trimmedValue) {
              const camelCaseProperty = convertCSSPropertyName(property.trim())
              styles[camelCaseProperty] = trimmedValue
            }
          }
        }
      }
    })

    return styles
  }

  const getInitialStudentStyles = (studentIndex: number) => {
    const baseStyles = level.students[studentIndex]?.style || {}
    return baseStyles
  }

  const getPlaceholderContainerStyle = () => {
    if (level.id === 10 || level.id === 11) {
      return {
        ...level.targetLayout,
        width: "100%",
        gap: "8px",
        minHeight: "450px",
        alignContent: "flex-start",
      }
    }

    if (level.id === 9) {
      return {
        ...level.targetLayout,
        width: "100%",
        minHeight: "450px",
        alignContent: "flex-start",
      }
    }

    const style = level.targetLayout
    return style
  }

  const getPlaceholderContainerClass = () => {
    if (level.id === 10 || level.id === 11) {
      return "absolute inset-8 pointer-events-none"
    }
    return "absolute inset-8 pointer-events-none"
  }

  return (
    <div className="classroom-preview rounded-2xl p-8 min-h-[400px] relative overflow-hidden bg-gradient-to-br from-blue-50 via-gray-50 to-teal-50 border-2 border-gray-200">
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div
        className="relative z-10 w-full h-full transition-all duration-300"
        style={containerStyle}
        id="student-container"
      >
        {level.students.map((student, index) => (
          <div
            key={index}
            className={`student w-20 h-20 rounded-full relative transition-all duration-500 hover:scale-110 shadow-lg flex items-center justify-center ${student.className || ""}`}
            style={{
              backgroundColor: student.color,
              ...getInitialStudentStyles(index),
              ...getStudentStyles(index),
              boxShadow: `0 8px 16px ${student.color}60, inset 0 2px 0 rgba(255,255,255,0.4)`,
            }}
          >
            <div className="relative">
              <div className="flex gap-2 mb-1">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              </div>
              <div className="w-4 h-2 border-b-2 border-gray-900 rounded-b-full mx-auto"></div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={
          level.id === 10 || level.id === 11
            ? "absolute inset-0 pointer-events-none p-8"
            : "absolute inset-8 pointer-events-none"
        }
      >
        <div
          className={
            level.id === 10 || level.id === 11
              ? "w-full flex transition-all duration-300"
              : "w-full h-full flex transition-all duration-300"
          }
          style={getPlaceholderContainerStyle()}
        >
          {level.desks.map((desk, index) => (
            <div
              key={index}
              className="desk w-20 h-20 rounded-xl opacity-40 border-2 border-dashed transition-all duration-300 hover:opacity-60 hover:border-solid"
              style={{
                backgroundColor: desk.color,
                borderColor: desk.color,
                ...desk.style,
                background: `linear-gradient(135deg, ${desk.color}, ${desk.color}dd)`,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                <div className="w-3/4 h-0.5 bg-current opacity-30 rounded"></div>
                <div className="w-3/4 h-0.5 bg-current opacity-30 rounded"></div>
                <div className="w-3/4 h-0.5 bg-current opacity-30 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-20 animate-in fade-in duration-500">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                {["🎉", "🎊", "✨", "⭐"][i % 4]}
              </div>
            ))}
          </div>

          <div className="text-center bg-background/95 p-8 rounded-2xl border-2 border-primary shadow-2xl animate-in zoom-in duration-300">
            <div className="text-6xl mb-3 animate-bounce">🎯</div>
            <p className="text-primary font-bold text-2xl mb-2">Excellent Work!</p>
            <p className="text-muted-foreground text-sm">Students reached their desks!</p>
          </div>
        </div>
      )}
    </div>
  )
}
