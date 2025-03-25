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
  unit?: string
  written?: number
  continuous?: number
  project?: number
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

// Mettre à jour les mappings pour inclure toutes les matières

// ADI1 course to unit mapping based on the PDF document
const adi1CourseToUnitMapping: Record<string, string> = {
  // Semestre 1
  "Mathématiques 1 S1": "Mathématiques S1",
  "Mathématiques 2 S1": "Mathématiques S1",
  "Mathématiques 3 S1": "Mathématiques S1",
  "C Microcontrôleur et algorithmie 1 S1": "Informatique S1",
  "Bureautique S1": "Informatique S1",
  "Web 1 S1": "Informatique S1",
  "Mécanique 1 S1": "Sciences de l'Ingénieur S1",
  "Electronique Numérique 1 S1": "Sciences de l'Ingénieur S1",
  "Machines-Outils S1": "Sciences de l'Ingénieur S1",
  "Projets Alpha S1": "Projet S1",
  "Projets Beta S1": "Projet S1",
  "Projet Gamma S1": "Projet S1",
  "Gestion de projet S1": "Projet S1",
  "Introduction à la pensée critique S1": "Humanités S1",
  "Projet Professionnel et Personnel S1": "Humanités S1",
  "Communication interculturelle S1": "Humanités S1",
  "Français S1": "Humanités S1",
  "Anglais S1": "Humanités S1",

  // Semestre 2
  "Mathématiques 4 S2": "Mathématiques S2",
  "Mathématiques 5 S2": "Mathématiques S2",
  "Mathématiques 6 S2": "Mathématiques S2",
  "Algorithmie 2 S2": "Informatique S2",
  "Web 2 S2": "Informatique S2",
  "Electronique Numérique 2 S2": "Sciences de l'Ingénieur S2",
  "Thermodynamique S2": "Sciences de l'Ingénieur S2",
  "Mécanique 2 S2": "Sciences de l'Ingénieur S2",
  "Matériaux S2": "Sciences de l'Ingénieur S2",
  "Projets Alpha S2": "Projet S2",
  "Projets Beta S2": "Projet S2",
  "Projet Gamma S2": "Projet S2",
  "Compétences Relationnelles S2": "Humanités S2",
  "Séminaire créativité S2": "Humanités S2",
  "Communication interculturelle S2": "Humanités S2",
  "Français S2": "Humanités S2",
  "Anglais S2": "Humanités S2",
}

// ADI2 course to unit mapping based on the PDF document
const adi2CourseToUnitMapping: Record<string, string> = {
  // Semestre 3
  "Mathématiques 7 S3": "Mathématiques S3",
  "Mathématiques 8 S3": "Mathématiques S3",
  "Mathématiques 9 S3": "Mathématiques S3",
  "Python S3": "Informatique S3",
  "Histoire des Technologies Informatiques S3": "Informatique S3",
  "Programmation et IA 1 S3": "Informatique S3",
  "Electronique Analogique S3": "Sciences de l'Ingénieur S3",
  "Electronique Appliquée S3": "Sciences de l'Ingénieur S3",
  "Automatique S3": "Sciences de l'Ingénieur S3",
  "Calcul numérique S3": "Sciences de l'Ingénieur S3",
  "Projets Alpha S3": "Projet S3",
  "Projets Beta S3": "Projet S3",
  "Projet Gamma S3": "Projet S3",
  "Compétences Relationnelles S3": "Humanités S3",
  "Projet Professionnel et Personnel S3": "Humanités S3",
  "Communication interculturelle S3": "Humanités S3",
  "Français S3": "Humanités S3",
  "Anglais S3": "Humanités S3",

  // Semestre 4
  "Mathématiques 10 S4": "Mathématiques S4",
  "Mathématiques 11 S4": "Mathématiques S4",
  "Mathématiques 12 S4": "Mathématiques S4",
  "Electromagnétisme S4": "Sciences de l'Ingénieur S4",
  "Mécanique des Ondes S4": "Sciences de l'Ingénieur S4",
  "Modélisation Assistée par Ordinateur S4": "Sciences de l'Ingénieur S4",
  "IoT S4": "Informatique S4",
  "Programmation et IA 2 S4": "Informatique S4",
  "Projets Alpha S4": "Projet S4",
  "Projets Beta S4": "Projet S4",
  "Projet Gamma S4": "Projet S4",
  "Introduction à la pensée critique S4": "Humanités S4",
  "Séminaire Eloquence et Rhétorique S4": "Humanités S4",
  "Communication interculturelle S4": "Humanités S4",
  "Français S4": "Humanités S4",
  "Anglais S4": "Humanités S4",
  "Stage S4": "Stage S4",
}

// Unit credits mapping based on the PDF document
const adi1UnitCreditsMapping: Record<string, number> = {
  "Mathématiques S1": 5,
  "Informatique S1": 5,
  "Sciences de l'Ingénieur S1": 6,
  "Projet S1": 8,
  "Humanités S1": 6,
  "Mathématiques S2": 5,
  "Informatique S2": 4,
  "Sciences de l'Ingénieur S2": 7,
  "Projet S2": 8,
  "Humanités S2": 6,
}

const adi2UnitCreditsMapping: Record<string, number> = {
  "Mathématiques S3": 6,
  "Informatique S3": 5,
  "Sciences de l'Ingénieur S3": 7,
  "Projet S3": 6,
  "Humanités S3": 6,
  "Mathématiques S4": 6,
  "Sciences de l'Ingénieur S4": 5,
  "Informatique S4": 5,
  "Projet S4": 6,
  "Humanités S4": 6,
  "Stage S4": 2,
}

// Course coefficients mapping based on the PDF document
const adi1CourseCoefficientsMapping: Record<string, number> = {
  // Semestre 1
  "Mathématiques 1 S1": 4,
  "Mathématiques 2 S1": 7,
  "Mathématiques 3 S1": 9,
  "C Microcontrôleur et algorithmie 1 S1": 2,
  "Bureautique S1": 1,
  "Web 1 S1": 1,
  "Mécanique 1 S1": 1,
  "Electronique Numérique 1 S1": 1,
  "Machines-Outils S1": 0,
  "Projets Alpha S1": 3,
  "Projets Beta S1": 3,
  "Projet Gamma S1": 2,
  "Gestion de projet S1": 2,
  "Introduction à la pensée critique S1": 2,
  "Projet Professionnel et Personnel S1": 2,
  "Communication interculturelle S1": 1,
  "Français S1": 2,
  "Anglais S1": 2,

  // Semestre 2
  "Mathématiques 4 S2": 4,
  "Mathématiques 5 S2": 7,
  "Mathématiques 6 S2": 9,
  "Algorithmie 2 S2": 2,
  "Web 2 S2": 1,
  "Electronique Numérique 2 S2": 3,
  "Thermodynamique S2": 2,
  "Mécanique 2 S2": 3,
  "Matériaux S2": 1,
  "Projets Alpha S2": 3,
  "Projets Beta S2": 3,
  "Projet Gamma S2": 2,
  "Compétences Relationnelles S2": 2,
  "Séminaire créativité S2": 2,
  "Communication interculturelle S2": 1,
  "Français S2": 2,
  "Anglais S2": 2,
}

const adi2CourseCoefficientsMapping: Record<string, number> = {
  // Semestre 3
  "Mathématiques 7 S3": 5,
  "Mathématiques 8 S3": 8,
  "Mathématiques 9 S3": 7,
  "Python S3": 1,
  "Histoire des Technologies Informatiques S3": 1,
  "Programmation et IA 1 S3": 1,
  "Electronique Analogique S3": 1,
  "Electronique Appliquée S3": 1,
  "Automatique S3": 1,
  "Calcul numérique S3": 1,
  "Projets Alpha S3": 3,
  "Projets Beta S3": 3,
  "Projet Gamma S3": 2,
  "Compétences Relationnelles S3": 2,
  "Projet Professionnel et Personnel S3": 2,
  "Communication interculturelle S3": 1,
  "Français S3": 2,
  "Anglais S3": 2,

  // Semestre 4
  "Mathématiques 10 S4": 8,
  "Mathématiques 11 S4": 7,
  "Mathématiques 12 S4": 5,
  "Electromagnétisme S4": 1,
  "Mécanique des Ondes S4": 1,
  "Modélisation Assistée par Ordinateur S4": 1,
  "IoT S4": 2,
  "Programmation et IA 2 S4": 1,
  "Projets Alpha S4": 3,
  "Projets Beta S4": 3,
  "Projet Gamma S4": 2,
  "Introduction à la pensée critique S4": 2,
  "Séminaire Eloquence et Rhétorique S4": 2,
  "Communication interculturelle S4": 1,
  "Français S4": 2,
  "Anglais S4": 2,
  "Stage S4": 0,
}

// Evaluation weights mapping based on the PDF document
const adi1EvaluationWeights: Record<string, { written: number; continuous: number; project: number }> = {
  // Semestre 1
  "Mathématiques 1 S1": { written: 33, continuous: 33, project: 34 },
  "Mathématiques 2 S1": { written: 45, continuous: 15, project: 40 },
  "Mathématiques 3 S1": { written: 45, continuous: 15, project: 40 },
  "C Microcontrôleur et algorithmie 1 S1": { written: 67, continuous: 33, project: 0 },
  "Bureautique S1": { written: 0, continuous: 100, project: 0 },
  "Web 1 S1": { written: 67, continuous: 33, project: 0 },
  "Mécanique 1 S1": { written: 75, continuous: 0, project: 25 },
  "Electronique Numérique 1 S1": { written: 25, continuous: 50, project: 25 },
  "Machines-Outils S1": { written: 0, continuous: 100, project: 0 },
  "Projets Alpha S1": { written: 0, continuous: 0, project: 100 },
  "Projets Beta S1": { written: 0, continuous: 0, project: 100 },
  "Projet Gamma S1": { written: 0, continuous: 0, project: 100 },
  "Gestion de projet S1": { written: 67, continuous: 33, project: 0 },
  "Introduction à la pensée critique S1": { written: 0, continuous: 100, project: 0 },
  "Projet Professionnel et Personnel S1": { written: 0, continuous: 100, project: 0 },
  "Communication interculturelle S1": { written: 0, continuous: 100, project: 0 },
  "Français S1": { written: 0, continuous: 100, project: 0 },
  "Anglais S1": { written: 0, continuous: 100, project: 0 },

  // Semestre 2
  "Mathématiques 4 S2": { written: 33, continuous: 33, project: 34 },
  "Mathématiques 5 S2": { written: 45, continuous: 15, project: 40 },
  "Mathématiques 6 S2": { written: 45, continuous: 15, project: 40 },
  "Algorithmie 2 S2": { written: 67, continuous: 33, project: 0 },
  "Web 2 S2": { written: 67, continuous: 33, project: 0 },
  "Electronique Numérique 2 S2": { written: 45, continuous: 30, project: 25 },
  "Thermodynamique S2": { written: 100, continuous: 0, project: 0 },
  "Mécanique 2 S2": { written: 75, continuous: 0, project: 25 },
  "Matériaux S2": { written: 67, continuous: 0, project: 33 },
  "Projets Alpha S2": { written: 0, continuous: 0, project: 100 },
  "Projets Beta S2": { written: 0, continuous: 0, project: 100 },
  "Projet Gamma S2": { written: 0, continuous: 0, project: 100 },
  "Compétences Relationnelles S2": { written: 0, continuous: 100, project: 0 },
  "Séminaire créativité S2": { written: 0, continuous: 0, project: 100 },
  "Communication interculturelle S2": { written: 0, continuous: 100, project: 0 },
  "Français S2": { written: 0, continuous: 100, project: 0 },
  "Anglais S2": { written: 0, continuous: 100, project: 0 },
}

const adi2EvaluationWeights: Record<string, { written: number; continuous: number; project: number }> = {
  // Semestre 3
  "Mathématiques 7 S3": { written: 33, continuous: 33, project: 34 },
  "Mathématiques 8 S3": { written: 45, continuous: 15, project: 40 },
  "Mathématiques 9 S3": { written: 45, continuous: 15, project: 40 },
  "Python S3": { written: 60, continuous: 40, project: 0 },
  "Histoire des Technologies Informatiques S3": { written: 50, continuous: 50, project: 0 },
  "Programmation et IA 1 S3": { written: 50, continuous: 50, project: 0 },
  "Electronique Analogique S3": { written: 100, continuous: 0, project: 0 },
  "Electronique Appliquée S3": { written: 50, continuous: 0, project: 50 },
  "Automatique S3": { written: 75, continuous: 25, project: 0 },
  "Calcul numérique S3": { written: 0, continuous: 100, project: 0 },
  "Projets Alpha S3": { written: 0, continuous: 0, project: 100 },
  "Projets Beta S3": { written: 0, continuous: 0, project: 100 },
  "Projet Gamma S3": { written: 0, continuous: 0, project: 100 },
  "Compétences Relationnelles S3": { written: 0, continuous: 100, project: 0 },
  "Projet Professionnel et Personnel S3": { written: 0, continuous: 100, project: 0 },
  "Communication interculturelle S3": { written: 0, continuous: 100, project: 0 },
  "Français S3": { written: 0, continuous: 100, project: 0 },
  "Anglais S3": { written: 0, continuous: 100, project: 0 },

  // Semestre 4
  "Mathématiques 10 S4": { written: 45, continuous: 15, project: 40 },
  "Mathématiques 11 S4": { written: 45, continuous: 15, project: 40 },
  "Mathématiques 12 S4": { written: 33, continuous: 33, project: 34 },
  "Electromagnétisme S4": { written: 100, continuous: 0, project: 0 },
  "Mécanique des Ondes S4": { written: 100, continuous: 0, project: 0 },
  "Modélisation Assistée par Ordinateur S4": { written: 0, continuous: 100, project: 0 },
  "IoT S4": { written: 67, continuous: 33, project: 0 },
  "Programmation et IA 2 S4": { written: 50, continuous: 50, project: 0 },
  "Projets Alpha S4": { written: 0, continuous: 0, project: 100 },
  "Projets Beta S4": { written: 0, continuous: 0, project: 100 },
  "Projet Gamma S4": { written: 0, continuous: 0, project: 100 },
  "Introduction à la pensée critique S4": { written: 0, continuous: 100, project: 0 },
  "Séminaire Eloquence et Rhétorique S4": { written: 0, continuous: 0, project: 100 },
  "Communication interculturelle S4": { written: 0, continuous: 100, project: 0 },
  "Français S4": { written: 0, continuous: 100, project: 0 },
  "Anglais S4": { written: 0, continuous: 100, project: 0 },
  "Stage S4": { written: 0, continuous: 0, project: 100 },
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
    name: data.studentName || "Étudiant Test",
    birthDate: data.birthDate || "01/01/2000",
    birthPlace: data.birthPlace || "VILLE - FRANCE",
    ine: data.ine || "000000000XX",
    class: data.class || (year === "ADI1" ? "ADI1 2024-2025" : "ADI2 2024-2025"),
    rank: data.rank || 1,
  }

  // Process grades and remove duplicates
  let grades: GradeEntry[] = []

  if (data.grades) {
    // Create a map to track unique grades by code
    const uniqueGrades = new Map()

    data.grades.forEach((grade: any) => {
      // If the grade has unit information from the form, use it to determine the unit
      const unit = grade.unit || courseToUnitMapping[grade.subject] || "Autre"

      // If the grade has evaluation weights from the form, use them
      const written = grade.written !== undefined ? grade.written : evaluationWeights[grade.subject]?.written || 33
      const continuous =
        grade.continuous !== undefined ? grade.continuous : evaluationWeights[grade.subject]?.continuous || 33
      const project = grade.project !== undefined ? grade.project : evaluationWeights[grade.subject]?.project || 34

      const gradeEntry: GradeEntry = {
        date: grade.date || new Date().toLocaleDateString("fr-FR"),
        code: grade.code || `MANUAL_${Date.now()}`,
        name: grade.name || "",
        subject: grade.subject || "",
        grade: Number.parseFloat(grade.grade) || 0,
        coefficient: Number.parseInt(grade.coefficient) || courseCoefficientsMapping[grade.subject] || 1,
        isWrittenExam: grade.isWrittenExam || false,
        isContinuousAssessment: grade.isContinuousAssessment || false,
        isProject: grade.isProject || false,
        unit,
        written,
        continuous,
        project,
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

