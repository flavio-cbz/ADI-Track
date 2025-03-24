export interface StudentData {
  studentInfo: {
    name: string
    birthDate: string
    birthPlace: string
    ine: string
    class: string
    rank: number
  }
  grades: GradeEntry[]
  courseAverages: CourseAverage[]
  unitAverages: UnitAverage[]
  generalAverage: number
  validatedCredits: number
  totalCredits: number
  totalStudents: number
  calculationSettings: {
    courseToUnitMapping: Record<string, string>
    unitCreditsMapping: Record<string, number>
    courseCoefficientsMapping: Record<string, number>
    evaluationWeights: Record<string, { written: number; continuous: number; project: number }>
    passingGrade: number
    useCompensation: boolean
    compensationThreshold: number
    year: string
  }
  goals: any[]
}

export interface GradeEntry {
  date: string
  code: string
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

const adi1CourseToUnitMapping: Record<string, string> = {
  "Algorithmique et Programmation": "Informatique",
  "Architecture de l'Ordinateur": "Informatique",
  Analyse: "Mathématiques",
  Algebre: "Mathématiques",
  Anglais: "Langues",
  "Communication et Projet Professionnel": "Soft Skills",
  "Introduction aux Systèmes d'Exploitation": "Informatique",
}

const adi2CourseToUnitMapping: Record<string, string> = {
  "Programmation Orientée Objet": "Informatique",
  "Probabilités et Statistiques": "Mathématiques",
  "Base de Données": "Informatique",
  "Conception d'Interfaces Homme-Machine": "Informatique",
  Anglais: "Langues",
  "Gestion de Projet": "Soft Skills",
  "Droit et Economie Numérique": "Soft Skills",
}

const adi1UnitCreditsMapping: Record<string, number> = {
  Informatique: 6,
  Mathématiques: 6,
  Langues: 3,
  "Soft Skills": 3,
}

const adi2UnitCreditsMapping: Record<string, number> = {
  Informatique: 9,
  Mathématiques: 3,
  Langues: 3,
  "Soft Skills": 3,
}

const adi1CourseCoefficientsMapping: Record<string, number> = {
  "Algorithmique et Programmation": 1,
  "Architecture de l'Ordinateur": 1,
  Analyse: 1,
  Algebre: 1,
  Anglais: 1,
  "Communication et Projet Professionnel": 1,
  "Introduction aux Systèmes d'Exploitation": 1,
}

const adi2CourseCoefficientsMapping: Record<string, number> = {
  "Programmation Orientée Objet": 1,
  "Probabilités et Statistiques": 1,
  "Base de Données": 1,
  "Conception d'Interfaces Homme-Machine": 1,
  Anglais: 1,
  "Gestion de Projet": 1,
  "Droit et Economie Numérique": 1,
}

const adi1EvaluationWeights: Record<string, { written: number; continuous: number; project: number }> = {
  "Algorithmique et Programmation": { written: 50, continuous: 50, project: 0 },
  "Architecture de l'Ordinateur": { written: 50, continuous: 50, project: 0 },
  Analyse: { written: 50, continuous: 50, project: 0 },
  Algebre: { written: 50, continuous: 50, project: 0 },
  Anglais: { written: 33, continuous: 33, project: 34 },
  "Communication et Projet Professionnel": { written: 0, continuous: 50, project: 50 },
  "Introduction aux Systèmes d'Exploitation": { written: 50, continuous: 50, project: 0 },
}

const adi2EvaluationWeights: Record<string, { written: number; continuous: number; project: number }> = {
  "Programmation Orientée Objet": { written: 50, continuous: 50, project: 0 },
  "Probabilités et Statistiques": { written: 50, continuous: 50, project: 0 },
  "Base de Données": { written: 50, continuous: 50, project: 0 },
  "Conception d'Interfaces Homme-Machine": { written: 33, continuous: 33, project: 34 },
  Anglais: { written: 33, continuous: 33, project: 34 },
  "Gestion de Projet": { written: 0, continuous: 50, project: 50 },
  "Droit et Economie Numérique": { written: 100, continuous: 0, project: 0 },
}

export function processGradeData(data: any, useExistingSettings = false): StudentData {
  // Get calculation settings from data if they exist and useExistingSettings is true
  const calculationSettings = useExistingSettings && data.calculationSettings ? data.calculationSettings : {}

  // Determine which year's mappings to use
  const year = data.year || calculationSettings.year || "ADI1"

  // Use the appropriate mappings based on the year
  const defaultCourseToUnitMapping = year === "ADI1" ? adi1CourseToUnitMapping : adi2CourseToUnitMapping
  const defaultUnitCreditsMapping = year === "ADI1" ? adi1UnitCreditsMapping : adi2UnitCreditsMapping
  const defaultCourseCoefficientsMapping =
    year === "ADI1" ? adi1CourseCoefficientsMapping : adi2CourseCoefficientsMapping
  const defaultEvaluationWeights = year === "ADI1" ? adi1EvaluationWeights : adi2EvaluationWeights

  // Use provided settings or fall back to defaults
  const courseToUnitMapping = calculationSettings.courseToUnitMapping || defaultCourseToUnitMapping
  const unitCreditsMapping = calculationSettings.unitCreditsMapping || defaultUnitCreditsMapping
  const courseCoefficientsMapping = calculationSettings.courseCoefficientsMapping || defaultCourseCoefficientsMapping
  const evaluationWeights = calculationSettings.evaluationWeights || defaultEvaluationWeights
  const passingGrade = calculationSettings.passingGrade || 10
  const useCompensation = calculationSettings.useCompensation !== undefined ? calculationSettings.useCompensation : true
  const compensationThreshold = calculationSettings.compensationThreshold || 8

  // Extract student information
  const studentInfo = {
    name: data.studentName || "Flavio COMBLEZ",
    birthDate: data.birthDate || "28/05/2006",
    birthPlace: data.birthPlace || "LILLE - FRANCE",
    ine: data.ine || "080273397CA",
    class: data.class || (year === "ADI1" ? "ADI1 2024-2025" : "ADI2 2024-2025"),
    rank: data.rank || 36,
  }

  // Process grades and remove duplicates
  let grades: GradeEntry[] = []

  if (data.grades) {
    // Create a map to track unique grades by code
    const uniqueGrades = new Map()

    data.grades.forEach((grade: any) => {
      const gradeEntry: GradeEntry = {
        date: grade.date || new Date().toLocaleDateString("fr-FR"),
        code: grade.code || `MANUAL_${Date.now()}`,
        name: grade.name || "",
        subject: grade.subject || "",
        grade: Number.parseFloat(grade.grade) || 0,
        coefficient: Number.parseInt(grade.coefficient) || 1,
        isWrittenExam: grade.isWrittenExam || false,
        isContinuousAssessment: grade.isContinuousAssessment || false,
        isProject: grade.isProject || false,
      }

      // Use code as unique identifier, or create one from name+subject if code is missing
      const uniqueId = gradeEntry.code || `${gradeEntry.name}_${gradeEntry.subject}`

      // Only add if not already present, or replace if better grade (for retakes)
      if (!uniqueGrades.has(uniqueId) || uniqueGrades.get(uniqueId).grade < gradeEntry.grade) {
        uniqueGrades.set(uniqueId, gradeEntry)
      }
    })

    // Convert map back to array
    grades = Array.from(uniqueGrades.values())
  }

  // Calculate course averages
  const courseGrades: Record<string, { written: number[]; continuous: number[]; project: number[] }> = {}

  // Initialize course grades structure
  Object.keys(courseCoefficientsMapping).forEach((course) => {
    courseGrades[course] = { written: [], continuous: [], project: [] }
  })

  // Populate course grades
  grades.forEach((grade) => {
    if (!grade.subject) return

    if (!courseGrades[grade.subject]) {
      courseGrades[grade.subject] = { written: [], continuous: [], project: [] }
    }

    if (grade.isWrittenExam) {
      courseGrades[grade.subject].written.push(grade.grade)
    } else if (grade.isContinuousAssessment) {
      courseGrades[grade.subject].continuous.push(grade.grade)
    } else if (grade.isProject) {
      courseGrades[grade.subject].project.push(grade.grade)
    }
  })

  // Calculate weighted averages for each course
  const courseAverages: CourseAverage[] = Object.keys(courseGrades).map((courseName) => {
    const grades = courseGrades[courseName]
    const weights = evaluationWeights[courseName] || { written: 33, continuous: 33, project: 34 }

    // Calculate average for each type
    const writtenAvg =
      grades.written.length > 0 ? grades.written.reduce((sum, grade) => sum + grade, 0) / grades.written.length : 0

    const continuousAvg =
      grades.continuous.length > 0
        ? grades.continuous.reduce((sum, grade) => sum + grade, 0) / grades.continuous.length
        : 0

    const projectAvg =
      grades.project.length > 0 ? grades.project.reduce((sum, grade) => sum + grade, 0) / grades.project.length : 0

    // Calculate weighted average
    let totalWeight = 0
    let weightedSum = 0

    if (grades.written.length > 0) {
      weightedSum += writtenAvg * weights.written
      totalWeight += weights.written
    }

    if (grades.continuous.length > 0) {
      weightedSum += continuousAvg * weights.continuous
      totalWeight += weights.continuous
    }

    if (grades.project.length > 0) {
      weightedSum += projectAvg * weights.project
      totalWeight += weights.project
    }

    const average = totalWeight > 0 ? weightedSum / totalWeight : 0

    return {
      courseName,
      coefficient: courseCoefficientsMapping[courseName] || 1,
      average,
      unitName: courseToUnitMapping[courseName] || "Autre",
    }
  })

  // Calculate unit averages
  const unitGrades: Record<string, { sum: number; totalCoef: number }> = {}

  courseAverages.forEach((course) => {
    if (!unitGrades[course.unitName]) {
      unitGrades[course.unitName] = { sum: 0, totalCoef: 0 }
    }

    unitGrades[course.unitName].sum += course.average * course.coefficient
    unitGrades[course.unitName].totalCoef += course.coefficient
  })

  const unitAverages: UnitAverage[] = Object.keys(unitGrades).map((unitName) => {
    const { sum, totalCoef } = unitGrades[unitName]
    const average = totalCoef > 0 ? sum / totalCoef : 0

    return {
      unitName,
      average,
      credits: unitCreditsMapping[unitName] || 0,
      validated: average >= passingGrade,
    }
  })

  // Calculate general average
  let totalWeightedSum = 0
  let totalCredits = 0

  unitAverages.forEach((unit) => {
    totalWeightedSum += unit.average * unit.credits
    totalCredits += unit.credits
  })

  const generalAverage = totalCredits > 0 ? totalWeightedSum / totalCredits : 0

  // Calculate validated credits based on compensation rules
  let validatedCredits = 0

  if (useCompensation) {
    // With compensation: units with average >= threshold can be compensated if general average >= passing grade
    const canCompensate = generalAverage >= passingGrade

    unitAverages.forEach((unit) => {
      if (unit.average >= passingGrade || (canCompensate && unit.average >= compensationThreshold)) {
        validatedCredits += unit.credits
        // Update validation status for display
        unit.validated = true
      }
    })
  } else {
    // Without compensation: only units with average >= passing grade are validated
    validatedCredits = unitAverages.filter((unit) => unit.validated).reduce((sum, unit) => sum + unit.credits, 0)
  }

  return {
    studentInfo,
    grades,
    courseAverages,
    unitAverages,
    generalAverage,
    validatedCredits,
    totalCredits,
    totalStudents: 51,
    calculationSettings: {
      courseToUnitMapping,
      unitCreditsMapping,
      courseCoefficientsMapping,
      evaluationWeights,
      passingGrade,
      useCompensation,
      compensationThreshold,
      year, // Assurez-vous que l'année est incluse dans les paramètres de calcul
    },
    goals: data.goals || [], // Préserver les objectifs s'ils existent
  }
}

