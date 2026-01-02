"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { saveStudentUsername } from "@/lib/supabase"
import { createClient } from "@/lib/supabase/client"

interface UsernameModalProps {
  onUsernameSubmit: (username: string, name: string) => void
}

export function UsernameModal({ onUsernameSubmit }: UsernameModalProps) {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"signup" | "login">("signup")

  const validateUsername = (username: string) => {
    // Username must be 3-20 characters
    if (username.length < 3) {
      return "Username must be at least 3 characters"
    }
    if (username.length > 20) {
      return "Username must be less than 20 characters"
    }

    // Only allow letters, numbers, dots, and underscores
    const usernamePattern = /^[a-zA-Z0-9._]+$/
    if (!usernamePattern.test(username)) {
      return "Username can only contain letters, numbers, dots, and underscores"
    }

    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const normalizedUsername = username.toLowerCase().trim()
    const validationError = validateUsername(normalizedUsername)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    // Check if username exists in database
    const supabase = createClient()
    const { data, error: dbError } = await supabase
      .from("students")
      .select("username, name")
      .eq("username", normalizedUsername)
      .single()

    if (dbError || !data) {
      setError("Username not found. Please check your username or sign up.")
      setLoading(false)
      return
    }

    // Save to localStorage
    localStorage.setItem("student_username", data.username)
    localStorage.setItem("student_name", data.name)

    // Update last active
    await supabase.from("students").update({ last_active: new Date().toISOString() }).eq("username", data.username)

    onUsernameSubmit(data.username, data.name)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate username
    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }

    // Validate name
    if (name.trim().length < 2) {
      return setError("Please enter your name (at least 2 characters)")
    }

    setLoading(true)

    // Save to Supabase (convert to lowercase for consistency)
    const normalizedUsername = username.toLowerCase().trim()
    const result = await saveStudentUsername(normalizedUsername, name.trim())

    if (result.success) {
      // Save to localStorage so modal doesn't show again
      localStorage.setItem("student_username", normalizedUsername)
      localStorage.setItem("student_name", name.trim())

      // Notify parent component
      onUsernameSubmit(normalizedUsername, name.trim())
    } else {
      if (result.error?.code === "23505") {
        // Unique constraint violation - username already exists
        setError("This username is already taken. Please choose another one.")
      } else {
        setError("Failed to save your information. Please try again.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            {mode === "signup" ? "Welcome to Flexbox Learning Game!" : "Welcome Back!"}
          </h2>
          <p className="text-muted-foreground text-center">
            {mode === "signup"
              ? "Create your username to get started and track your progress"
              : "Enter your username to continue your progress"}
          </p>
        </div>

        <form onSubmit={mode === "signup" ? handleSignup : handleLogin} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              {mode === "signup" ? "Create Username" : "Username"}
            </label>
            <Input
              id="username"
              type="text"
              placeholder="alex.smith or alexsmith123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            {mode === "signup" && (
              <p className="text-xs text-muted-foreground">
                3-20 characters. Letters, numbers, dots, and underscores only.
              </p>
            )}
          </div>

          {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? mode === "signup"
                ? "Creating..."
                : "Logging in..."
              : mode === "signup"
                ? "Start Learning"
                : "Continue"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup")
              setError("")
              setUsername("")
              setName("")
            }}
            className="text-sm text-primary hover:underline"
            disabled={loading}
          >
            {mode === "signup" ? "Already have a username? Login" : "Don't have a username? Sign up"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your progress will be saved automatically. Remember your username to continue later!
        </p>
      </Card>
    </div>
  )
}
