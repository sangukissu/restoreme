"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function signInWithMagicLink(formData: FormData) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      redirect("/auth/login?error=Authentication service unavailable")
    }

    const email = formData.get("email") as string

    if (!email) {
      redirect("/auth/login?error=Email is required")
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      redirect("/auth/login?error=Could not send magic link")
    }

    revalidatePath("/", "layout")
    redirect("/auth/login?message=Check your email for the magic link")
  } catch (error) {
    console.error("Magic link error:", error)
    redirect("/auth/login?error=Authentication failed")
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      redirect("/auth/login?error=Authentication service unavailable")
    }

    // Fixed redirect URL and return handling for Google OAuth
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
    const supabase = await createClient()

    if (!supabase) {
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

export const signIn = signInWithMagicLink
export const signUp = signInWithMagicLink
export const login = signInWithMagicLink
export const signup = signInWithMagicLink
