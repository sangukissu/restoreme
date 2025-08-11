import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { createClient } from "@/utils/supabase/server"

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Allowed file types and size limits
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Input sanitization function
function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "")
  }
  if (typeof input === "number") {
    return Math.max(0, Math.min(input, Number.MAX_SAFE_INTEGER))
  }
  return input
}

// File validation function
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 10MB.",
    }
  }

  // Check if file name is reasonable
  if (file.name.length > 255) {
    return {
      valid: false,
      error: "File name too long.",
    }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { data: credits, error: creditsError } = await supabase
      .from("credits")
      .select("credits_remaining")
      .eq("user_id", user.id)
      .single()

    if (creditsError || !credits || credits.credits_remaining <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("image") as File
    const seed = formData.get("seed") as string
    const outputFormat = formData.get("output_format") as string
    const safetyTolerance = formData.get("safety_tolerance") as string

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 })
    }

    // Convert file to base64 for Replicate
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Prepare input for Replicate API with sanitization
    const input: any = {
      input_image: dataUrl,
    }

    // Add optional parameters if provided
    if (seed) {
      const sanitizedSeed = sanitizeInput(Number.parseInt(seed))
      if (!isNaN(sanitizedSeed)) {
        input.seed = sanitizedSeed
      }
    }

    if (outputFormat) {
      const sanitizedFormat = sanitizeInput(outputFormat)
      if (["png", "jpg", "webp"].includes(sanitizedFormat)) {
        input.output_format = sanitizedFormat
      }
    }

    if (safetyTolerance) {
      const sanitizedTolerance = sanitizeInput(Number.parseInt(safetyTolerance))
      if (!isNaN(sanitizedTolerance) && sanitizedTolerance >= 0 && sanitizedTolerance <= 2) {
        input.safety_tolerance = sanitizedTolerance
      }
    }

    // Call Replicate API
    const output = await replicate.run("flux-kontext-apps/restore-image", {
      input,
    })

    // Validate output
    if (!output || typeof output !== "string") {
      return NextResponse.json({ error: "Invalid response from restoration service" }, { status: 500 })
    }

    const { error: insertError } = await supabase.from("image_restorations").insert({
      user_id: user.id,
      original_filename: file.name,
      restored_image_url: output,
      status: "completed",
    })

    if (insertError) {
      console.error("Error saving restoration record:", insertError)
    }

    const { error: updateError } = await supabase
      .from("credits")
      .update({ credits_remaining: credits.credits_remaining - 1 })
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating credits:", updateError)
    }

    // Return the restored image URL
    return NextResponse.json({
      success: true,
      restoredImageUrl: output,
      originalFileName: file.name,
      processedAt: new Date().toISOString(),
      creditsRemaining: credits.credits_remaining - 1,
    })
  } catch (error) {
    console.error("Error in image restoration:", error)

    // Handle specific Replicate errors
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        return NextResponse.json({ error: "Authentication failed with restoration service" }, { status: 401 })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
      }
    }

    return NextResponse.json({ error: "Failed to restore image. Please try again." }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Restore.me API",
    timestamp: new Date().toISOString(),
    replicateConfigured: !!process.env.REPLICATE_API_TOKEN,
  })
}
