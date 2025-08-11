import { createClient, isSupabaseConfigured } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/sign-up-form"

export default async function SignUpPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-4 text-black">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <SignUpForm />
    </div>
  )
}
