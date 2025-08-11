import { createClient, isSupabaseConfigured } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-4 text-black">Connect Supabase to get started</h1>
      </div>
    )
  }

  try {
    // Check if user is already logged in
    const supabase = createClient()

    if (!supabase) {
      console.error("Failed to create Supabase client")
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      )
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is logged in, redirect to dashboard
    if (session) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Error checking session:", error)
    // Continue to show login form even if session check fails
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
