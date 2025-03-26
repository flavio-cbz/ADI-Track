import { type NextRequest, NextResponse } from "next/server"
import { deleteUser, updateUserPreferences } from "@/lib/auth.actions"
import { getCurrentUser } from "@/lib/auth.actions"

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    if (!user.isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 })
    }

    const result = await deleteUser(params.userId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Delete user error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Only allow users to update their own preferences, or admins to update any user
    if (user.id !== params.userId && !user.isAdmin) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 })
    }

    const data = await request.json()
    const result = await updateUserPreferences(params.userId, data)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

