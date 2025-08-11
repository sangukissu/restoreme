import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardClient from "@/components/dashboard-client"

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: credits } = await supabase.from("credits").select("credits_remaining").eq("user_id", user.id).single()

  return <DashboardClient user={user} credits={credits?.credits_remaining || 0} />
}
