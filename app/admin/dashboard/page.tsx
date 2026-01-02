"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Users, Clock, Trophy, Star, Search } from "lucide-react"
import { AdminPasswordGate } from "@/components/admin-password-gate"

interface Student {
  username: string
  name: string
  first_seen: string
  last_active: string
}

interface Progress {
  username: string
  completed_count: number
  total_time: number
}

interface Feedback {
  username: string
  rating: number
  comments: string
  submitted_at: string
}

interface Session {
  username: string
  started_at: string
  last_ping: string
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map())
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"progress" | "feedback">("progress")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    const { data: studentsData } = await supabase
      .from("students")
      .select("*")
      .order("last_active", { ascending: false })

    const { data: progressData } = await supabase.from("level_progress").select("username, completed, time_spent")

    const { data: feedbackData } = await supabase
      .from("student_feedback")
      .select("*")
      .order("submitted_at", { ascending: false })

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
    const { data: sessionsData } = await supabase
      .from("game_sessions")
      .select("username, started_at, last_ping")
      .gte("last_ping", twoMinutesAgo)
      .order("last_ping", { ascending: false })

    console.log("[v0] Active sessions query - 2 min ago:", twoMinutesAgo)
    console.log("[v0] Active sessions found:", sessionsData)

    if (studentsData) setStudents(studentsData)
    if (feedbackData) setFeedback(feedbackData)
    if (sessionsData) setActiveSessions(sessionsData)

    if (progressData) {
      const progressMap = new Map<string, Progress>()

      if (studentsData) {
        studentsData.forEach((student) => {
          progressMap.set(student.username, { username: student.username, completed_count: 0, total_time: 0 })
        })
      }

      progressData.forEach((p) => {
        const existing = progressMap.get(p.username) || { username: p.username, completed_count: 0, total_time: 0 }
        if (p.completed) {
          existing.completed_count++
        }
        existing.total_time += p.time_spent || 0
        progressMap.set(p.username, existing)
      })

      setProgress(progressMap)
    }

    setLoading(false)
  }

  const exportToCSV = () => {
    const csvData = students.map((student) => {
      const studentProgress = progress.get(student.username) || { completed_count: 0, total_time: 0 }
      const studentFeedback = feedback.find((f) => f.username === student.username)
      const isActive = activeSessions.some((s) => s.username === student.username)

      return {
        Student: `${student.name || "N/A"} (@${student.username})`,
        Progress: `'${studentProgress.completed_count}/12`,
        "Time Spent": `${Math.round(studentProgress.total_time / 60)} min`,
        Status: isActive ? "Playing" : "Inactive",
        Feedback: studentFeedback ? `${studentFeedback.rating} stars: ${studentFeedback.comments}` : "-",
      }
    })

    const headers = ["Student", "Progress", "Time Spent", "Status", "Feedback"]
    const csv = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row]
            // Properly escape values containing commas or quotes
            if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
              return `"${value}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `flexbox-progress-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalStudents = students.length
  const activeNow = activeSessions.length
  const avgProgress =
    students.length > 0
      ? Math.round(
          (Array.from(progress.values()).reduce((sum, p) => sum + p.completed_count, 0) / students.length) * 10,
        ) / 10
      : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminPasswordGate>
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
              <p className="text-muted-foreground">Monitor student progress in real-time</p>
            </div>
            <Button onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Playing Now</p>
                  <p className="text-2xl font-bold">{activeNow}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">{avgProgress}/12</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab("progress")}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === "progress" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
              >
                Student Progress
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`pb-2 px-1 font-medium transition-colors ${
                  activeTab === "feedback" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
              >
                Feedback ({feedback.length})
              </button>
            </div>

            {activeTab === "progress" && (
              <>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Student</th>
                        <th className="text-left p-3 font-medium">Progress</th>
                        <th className="text-left p-3 font-medium">Time Spent</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => {
                        const studentProgress = progress.get(student.username) || { completed_count: 0, total_time: 0 }
                        const isActive = activeSessions.some((s) => s.username === student.username)
                        const studentFeedback = feedback.find((f) => f.username === student.username)

                        return (
                          <tr key={student.username} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{student.name || "N/A"}</p>
                                <p className="text-sm text-muted-foreground">@{student.username}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${(studentProgress.completed_count / 12) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{studentProgress.completed_count}/12</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-sm">{Math.round(studentProgress.total_time / 60)} min</span>
                            </td>
                            <td className="p-3">
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                  Playing
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Inactive</span>
                              )}
                            </td>
                            <td className="p-3">
                              {studentFeedback ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 text-sm">
                                    {studentFeedback.rating}
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                  </span>
                                  {studentFeedback.comments && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
                                      {studentFeedback.comments}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No feedback yet</p>
                ) : (
                  feedback.map((fb, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {students.find((s) => s.username === fb.username)?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">@{fb.username}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                      {fb.comments && <p className="text-sm text-muted-foreground mt-2">{fb.comments}</p>}
                      <p className="text-xs text-muted-foreground mt-2">{new Date(fb.submitted_at).toLocaleString()}</p>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminPasswordGate>
  )
}
