import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth callback error:", error)
      redirect("/auth/login?error=callback_error")
    }
  }

  // Redirect to dashboard after successful authentication
  redirect("/dashboard")
}
