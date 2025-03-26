export interface StudentInfo {
  name: string
  birthDate: string
  birthPlace?: string
  ine: string
  class: string
  rank: number
}

export interface GradeEntry {
  date: string
  code?: string
  name: string
  subject: string
  grade: number
  coefficient: number
  isWrittenExam: boolean
  isContinuousAssessment: boolean
  isProject: boolean
}

export interface CourseAverage {
  courseName: string
  coefficient: number
  average: number
  unitName: string
}

export interface UnitAverage {
  unitName: string
  average: number
  credits: number
  validated: boolean
}

export interface StudentData {
  studentInfo: StudentInfo
  grades: GradeEntry[]
  courseAverages: CourseAverage[]
  unitAverages: UnitAverage[]
  generalAverage: number
  validatedCredits: number
  totalCredits: number
  totalStudents: number
  calculationSettings?: {
    courseToUnitMapping: Record<string, string>
    unitCreditsMapping: Record<string, number>
    courseCoefficientsMapping: Record<string, number>
    evaluationWeights: Record<string, { written: number; continuous: number; project: number }>
    passingGrade: number
    useCompensation: boolean
    compensationThreshold: number
  }
}

