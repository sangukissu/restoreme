import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import FloatingHeader from "@/components/floating-header"

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <FloatingHeader />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 pb-16 text-center lg:pt-40">
          <h1 className="font-inter font-bold text-4xl sm:text-5xl lg:text-6xl text-black text-balance mb-6">
            Restore your memories with <span className="text-gray-600">AI precision</span>
          </h1>
          <p className="text-xl text-gray-600 text-balance max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform old, damaged, or low-quality photos into stunning restored images. Our advanced AI technology
            brings your precious memories back to life with professional-grade results in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-xl">
                Start Restoring
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg bg-transparent rounded-xl"
            >
              View Examples
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-gray-100">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-inter font-semibold text-lg text-black mb-2">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Get professional results in seconds, not hours. Our AI processes your images instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="font-inter font-semibold text-lg text-black mb-2">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning algorithms trained on millions of images for perfect restoration.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-inter font-semibold text-lg text-black mb-2">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your photos are processed securely and never stored. Complete privacy guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center border-t border-gray-100">
          <h2 className="font-inter font-bold text-3xl text-black mb-4">Ready to restore your memories?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their old photos into beautiful memories.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-xl">
              Get Started Now
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Restore.me. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
