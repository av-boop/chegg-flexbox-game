"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface AdminPasswordGateProps {
  children: React.ReactNode
}

export function AdminPasswordGate({ children }: AdminPasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authenticated = localStorage.getItem("admin_authenticated")
      if (authenticated === "true") {
        setIsAuthenticated(true)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "chegg2024"

    if (password === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <CardDescription>Enter password to access the instructor dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Password: Chegg@2025</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
