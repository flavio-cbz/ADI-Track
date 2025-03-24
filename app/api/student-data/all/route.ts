import { type NextRequest, NextResponse } from "next/server"
import { getAllStudentsData } from "@/lib/database.actions"
import { getCurrentUser } from "@/lib/auth.actions"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const result = await getAllStudentsData()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Get all student data error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

