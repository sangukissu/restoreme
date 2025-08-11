"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn, signInWithMagicLink, signInWithGoogle } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium rounded-lg h-12"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

function MagicLinkButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="w-full border-gray-300 hover:bg-gray-50 text-black py-3 text-base font-medium rounded-lg h-12 bg-transparent"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending link...
        </>
      ) : (
        <>
          <Mail className="mr-2 h-4 w-4" />
          Send Magic Link
        </>
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const [magicLinkState, magicLinkAction] = useActionState(signInWithMagicLink, null)
  const [showMagicLink, setShowMagicLink] = useState(false)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign in error:", error)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black">Welcome back</h1>
        <p className="text-lg text-gray-600">Sign in to Restore.me</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {!showMagicLink ? (
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 rounded-lg h-12"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-white border-gray-300 text-black rounded-lg h-12"
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        ) : (
          <form action={magicLinkAction} className="space-y-6">
            {magicLinkState?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {magicLinkState.error}
              </div>
            )}

            {magicLinkState?.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {magicLinkState.success}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-white border-gray-300 text-black placeholder:text-gray-500 rounded-lg h-12"
              />
            </div>

            <MagicLinkButton />
          </form>
        )}

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50 text-black py-3 text-base font-medium rounded-lg h-12 bg-transparent"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            onClick={() => setShowMagicLink(!showMagicLink)}
            variant="ghost"
            className="w-full text-gray-600 hover:text-black py-3 text-base font-medium rounded-lg h-12"
          >
            {showMagicLink ? "Back to password login" : "Use magic link instead"}
          </Button>
        </div>

        <div className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-black hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
