"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Sparkles } from "lucide-react"
import { submitFeedback } from "@/lib/progress-sync"

interface FeedbackModalProps {
  studentUsername: string
  onClose: () => void
}

export function FeedbackModal({ studentUsername, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting")
      return
    }

    setLoading(true)
    const result = await submitFeedback(studentUsername, rating, comments)

    if (result.success) {
      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } else {
      alert("Failed to submit feedback. Please try again.")
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <p className="text-muted-foreground">You've completed all 12 levels! How was your experience?</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rate your experience</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className="w-8 h-8"
                    fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium">
              Any comments or suggestions? (optional)
            </label>
            <textarea
              id="comments"
              className="w-full min-h-24 p-3 rounded-md border bg-background"
              placeholder="Share your thoughts..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose} disabled={loading}>
              Skip
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={loading || rating === 0}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
