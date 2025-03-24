import { type NextRequest, NextResponse } from "next/server"
import { deleteStudentData } from "@/lib/database.actions"
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

    const result = await deleteStudentData(params.userId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Delete student data error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

