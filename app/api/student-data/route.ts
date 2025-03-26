import { type NextRequest, NextResponse } from "next/server"
import { saveStudentData, getStudentData } from "@/lib/database.actions"
import { getCurrentUser } from "@/lib/auth.actions"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const result = await getStudentData()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Get student data error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const data = await request.json()
    const result = await saveStudentData(data)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Save student data error:", error)
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 })
  }
}

