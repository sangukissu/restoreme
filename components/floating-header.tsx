"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function FloatingHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg transition-all duration-300 ${
            isScrolled ? "shadow-xl" : "shadow-lg"
          }`}
        >
          <div className="flex justify-between items-center h-16 px-6">
            <div className="flex items-center">
              <Link href="/" className="font-inter font-bold text-xl text-black hover:text-gray-700 transition-colors">
                Restore.me
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-black hover:bg-gray-100/50 rounded-xl px-4 py-2 transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 py-2 shadow-sm hover:shadow-md transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
