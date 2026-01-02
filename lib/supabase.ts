import { createClient as createBrowserClient } from "./supabase/client"

export async function saveStudentUsername(username: string, name: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("students")
    .insert({
      username,
      name,
      first_seen: new Date().toISOString(),
      last_active: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error("Error saving student username:", error)
    return { success: false, error }
  }

  return { success: true, data }
}

export async function updateLastActive(username: string) {
  const supabase = createBrowserClient()

  const { error } = await supabase
    .from("students")
    .update({ last_active: new Date().toISOString() })
    .eq("username", username)

  if (error) {
    console.error("Error updating last active:", error)
  }
}

export async function fetchUserProgress(username: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("level_progress")
    .select("level_number, code_solution")
    .eq("username", username)
    .eq("completed", true)

  if (error) {
    console.error("Error fetching user progress:", error)
    return { success: false, completedLevels: [], codeSolutions: {} }
  }

  const completedLevels = data.map((row) => row.level_number)
  const codeSolutions: { [key: number]: string } = {}
  data.forEach((row) => {
    if (row.code_solution) {
      codeSolutions[row.level_number] = row.code_solution
    }
  })

  return { success: true, completedLevels, codeSolutions }
}

export async function resetLevelInDatabase(username: string, levelNumber: number) {
  const supabase = createBrowserClient()

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
  const supabase = createBrowserClient()

  const { error } = await supabase.from("level_progress").delete().eq("username", username)

  if (error) {
    console.error("Error resetting all progress in database:", error)
    return { success: false, error }
  }

  return { success: true }
}
