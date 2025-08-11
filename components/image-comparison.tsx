"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface ImageComparisonProps {
  originalUrl: string
  restoredUrl: string
  onStartOver: () => void
}

export default function ImageComparison({ originalUrl, restoredUrl, onStartOver }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percentage)
    },
    [isDragging],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percentage)
    },
    [isDragging],
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

  const handleDownload = async () => {
    try {
      const response = await fetch(restoredUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `restored-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Failed to download image")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="font-inter font-semibold text-2xl text-black mb-2">Restoration Complete!</h3>
            <p className="text-gray-600">Drag the slider to compare before and after</p>
          </div>

          {/* Image Comparison Container */}
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden cursor-col-resize select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Restored Image (Background) */}
            <img
              src={restoredUrl || "/placeholder.svg"}
              alt="Restored image"
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />

            {/* Original Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={originalUrl || "/placeholder.svg"}
                alt="Original image"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Original
            </div>
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Restored
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleDownload}
              className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-base font-medium rounded-full"
            >
              Download Restored
            </Button>
            <Button
              onClick={onStartOver}
              variant="outline"
              className="px-6 py-3 text-base font-medium rounded-full bg-transparent"
            >
              Restore Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
