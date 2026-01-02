import { createClient } from "./supabase/client"

export async function saveProgress(username: string, levelNumber: number, codeSolution: string, timeSpent: number) {
  const supabase = createClient()

  const { error } = await supabase.from("level_progress").upsert(
    {
      username,
      level_number: levelNumber,
      code_solution: codeSolution,
      completed: true,
      time_spent: timeSpent,
      completed_at: new Date().toISOString(),
    },
    {
      onConflict: "username,level_number",
    },
  )

  if (error) {
    console.error("Error saving progress:", error)
    return { success: false, error }
  }

  return { success: true }
}

export const syncLevelProgress = saveProgress

export async function startSession(username: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      username,
      started_at: new Date().toISOString(),
      last_ping: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error starting session:", error)
    return { success: false, sessionId: null }
  }

  return { success: true, sessionId: data.id }
}

export async function updateSession(sessionId: number, duration: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from("game_sessions")
    .update({
      last_ping: new Date().toISOString(),
      duration,
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Error updating session:", error)
  }
}

export const pingSession = updateSession

export async function endSession(sessionId: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from("game_sessions")
    .update({
      last_ping: new Date().toISOString(),
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Error ending session:", error)
  }
}

export async function submitFeedback(username: string, rating: number, comments: string) {
  const supabase = createClient()

  const { error } = await supabase.from("student_feedback").insert({
    username,
    rating,
    comments,
    submitted_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error submitting feedback:", error)
    return { success: false, error }
  }

  return { success: true }
}

export async function resetLevelInDatabase(username: string, levelNumber: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from("level_progress")
    .delete()
    .eq("username", username)
    .eq("level_number", levelNumber)

  if (error) {
    console.error("Error resetting level in database:", error)
    return { success: false, error }
  }

  return { success: true }
}

export async function resetAllProgressInDatabase(username: string) {
  const supabase = createClient()

  const { error } = await supabase.from("level_progress").delete().eq("username", username)

  if (error) {
    console.error("Error resetting all progress in database:", error)
    return { success: false, error }
  }

  return { success: true }
}
