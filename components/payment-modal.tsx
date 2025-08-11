"use client"

import { useState } from "react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSkip: () => void
  onPurchase: () => void
}

export default function PaymentModal({ isOpen, onClose, onSkip, onPurchase }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handlePurchase = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    onPurchase()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h2 className="font-inter font-bold text-2xl text-black mb-2">Get Credits to Start</h2>
            <p className="text-gray-600">Purchase credits to restore your images with AI</p>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-black">$2</span>
                <span className="text-gray-600">USD</span>
              </div>
              <div className="text-gray-600 mb-4">Get 5 restoration credits</div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Credits included:</span>
                  <span className="font-medium text-black">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cost per restoration:</span>
                  <span className="font-medium text-black">$0.40</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Valid for:</span>
                  <span className="font-medium text-black">Lifetime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">AI-powered image restoration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">High-quality results in seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Download restored images</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 px-6 py-3 rounded font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Purchase Credits - $2"
              )}
            </button>

            <button
              onClick={onSkip}
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">Secure payment processing. No subscription required.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
