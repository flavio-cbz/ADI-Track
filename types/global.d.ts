import type { StudentData } from "@/types/grades"

declare global {
  var studentData: StudentData | undefined
}

