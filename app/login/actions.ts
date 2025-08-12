"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function signInWithMagicLink(prevState: any, formData: FormData) {
  try {
    const supabase = createClient()

    if (!supabase || !supabase.auth) {
      return { error: "Authentication service unavailable" }
    }

    const email = formData.get("email") as string

    if (!email) {
      return { error: "Email is required" }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      return { error: "Could not send magic link. Please try again." }
    }

    return { success: "Check your email for the magic link!" }
  } catch (error) {
    console.error("Magic link error:", error)
    return { error: "Authentication failed. Please try again." }
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = createClient()

    if (!supabase || !supabase.auth) {
      redirect("/auth/login?error=Authentication service unavailable")
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      redirect("/auth/login?error=Could not authenticate with Google")
    }

    if (data.url) {
      redirect(data.url)
    }
  } catch (error) {
    console.error("Google auth error:", error)
    redirect("/auth/login?error=Authentication failed")
  }
}

export async function signOut() {
  try {
    const supabase = createClient()

    if (!supabase || !supabase.auth) {
      redirect("/error")
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      redirect("/error")
    }

    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    redirect("/error")
  }
}

// Legacy exports for backward compatibility
export const signIn = signInWithMagicLink
export const signUp = signInWithMagicLink
export const login = signInWithMagicLink
export const signup = signInWithMagicLink
