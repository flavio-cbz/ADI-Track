import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers } from "@/lib/auth.actions"
import { getCurrentUser } from "@/lib/auth.actions"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    if (!user.isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json({ success: true, users })
  } catch (error: any) {
    console.error("Get all users error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

