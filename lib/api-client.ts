export interface RestoreImageResponse {
  success: boolean
  restoredImageUrl?: string
  error?: string
}

export async function restoreImage(file: File): Promise<RestoreImageResponse> {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("/api/restore", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || "Failed to restore image",
      }
    }

    const data = await response.json()
    return {
      success: true,
      restoredImageUrl: data.restoredImageUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
