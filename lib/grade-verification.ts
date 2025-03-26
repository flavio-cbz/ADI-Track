// Fonction pour vérifier les calculs des moyennes à partir des notes extraites
export function verifyGradeCalculations(grades: any[]) {
  // Filtrer uniquement les notes du S1
  const s1Grades = grades.filter((grade) => grade.name.includes("S1") || grade.subject.includes("S1"))

  // Organiser les notes par matière
  const gradesBySubject: Record<string, any[]> = {}

  s1Grades.forEach((grade) => {
    const subject = grade.subject.replace(" S1", "")
    if (!gradesBySubject[subject]) {
      gradesBySubject[subject] = []
    }
    gradesBySubject[subject].push(grade)
  })

  // Calcul des moyennes par matière
  const subjectAverages: Record<string, { average: number; coefficient: number; unit: string }> = {
    // Mathématiques
    "Mathématiques 1": { average: 0, coefficient: 4.0, unit: "Mathématiques S1" },
    "Mathématiques 2": { average: 0, coefficient: 7.0, unit: "Mathématiques S1" },
    "Mathématiques 3": { average: 0, coefficient: 9.0, unit: "Mathématiques S1" },

    // Informatique
    "C Microcontrôleur et algorithmie 1": { average: 0, coefficient: 2.0, unit: "Informatique S1" },
    "Web 1": { average: 0, coefficient: 1.0, unit: "Informatique S1" },
    Bureautique: { average: 0, coefficient: 1.0, unit: "Informatique S1" },

    // Sciences
    "Electronique Numérique 1": { average: 0, coefficient: 1.0, unit: "Sciences de l'Ingénieur S1" },
    "Mécanique 1": { average: 0, coefficient: 1.0, unit: "Sciences de l'Ingénieur S1" },
    "Machines-Outils": { average: 0, coefficient: 0.0, unit: "Sciences de l'Ingénieur S1" },

    // Humanités
    "Introduction à la pensée critique": { average: 0, coefficient: 2.0, unit: "Humanités S1" },
    "Projet Professionnel et Personnel": { average: 0, coefficient: 2.0, unit: "Humanités S1" },
    Anglais: { average: 0, coefficient: 2.0, unit: "Humanités S1" },
    "Communication interculturelle": { average: 0, coefficient: 1.0, unit: "Humanités S1" },
    Français: { average: 0, coefficient: 2.0, unit: "Humanités S1" },

    // Projets
    "Projets Alpha": { average: 0, coefficient: 3.0, unit: "Projet S1" },
    "Projets Beta": { average: 0, coefficient: 3.0, unit: "Projet S1" },
    "Projet Gamma": { average: 0, coefficient: 2.0, unit: "Projet S1" },
    "Gestion de projet": { average: 0, coefficient: 2.0, unit: "Projet S1" },
  }

  // Calcul des moyennes par matière
  Object.keys(gradesBySubject).forEach((subject) => {
    const grades = gradesBySubject[subject]
    let totalWeightedGrade = 0
    let totalCoefficient = 0

    grades.forEach((grade) => {
      totalWeightedGrade += grade.grade * grade.coefficient
      totalCoefficient += grade.coefficient
    })

    if (totalCoefficient > 0 && subjectAverages[subject]) {
      subjectAverages[subject].average = totalWeightedGrade / totalCoefficient
    }
  })

  // Calcul des moyennes par UE
  const unitAverages: Record<string, { average: number; coefficient: number }> = {
    "Mathématiques S1": { average: 0, coefficient: 5.0 },
    "Informatique S1": { average: 0, coefficient: 5.0 },
    "Sciences de l'Ingénieur S1": { average: 0, coefficient: 6.0 },
    "Humanités S1": { average: 0, coefficient: 6.0 },
    "Projet S1": { average: 0, coefficient: 8.0 },
  }

  // Grouper les matières par UE
  const subjectsByUnit: Record<string, any[]> = {}

  Object.entries(subjectAverages).forEach(([subject, data]) => {
    const { average, coefficient, unit } = data
    if (!subjectsByUnit[unit]) {
      subjectsByUnit[unit] = []
    }
    subjectsByUnit[unit].push({ subject, average, coefficient })
  })

  // Calcul des moyennes par UE
  Object.keys(unitAverages).forEach((unit) => {
    const subjects = subjectsByUnit[unit] || []
    let totalWeightedAverage = 0
    let totalCoefficient = 0

    subjects.forEach((subject) => {
      if (subject.average > 0) {
        totalWeightedAverage += subject.average * subject.coefficient
        totalCoefficient += subject.coefficient
      }
    })

    if (totalCoefficient > 0) {
      unitAverages[unit].average = totalWeightedAverage / totalCoefficient
    }
  })

  // Calcul de la moyenne générale
  let totalWeightedUnitAverage = 0
  let totalUnitCoefficient = 0

  Object.entries(unitAverages).forEach(([unit, data]) => {
    const { average, coefficient } = data
    if (average > 0) {
      totalWeightedUnitAverage += average * coefficient
      totalUnitCoefficient += coefficient
    }
  })

  const generalAverage = totalUnitCoefficient > 0 ? totalWeightedUnitAverage / totalUnitCoefficient : 0

  // Comparaison avec les moyennes du bulletin
  const bulletinAverages = {
    "Mathématiques S1": 11.54,
    "Informatique S1": 10.58,
    "Sciences de l'Ingénieur S1": 11.91,
    "Humanités S1": 14.2,
    "Projet S1": 10.27,
    "Moyenne Générale": 11.65,
  }

  const comparisonResults = {
    unitAverages: Object.entries(unitAverages).map(([unit, data]) => ({
      unit,
      calculatedAverage: Number.parseFloat(data.average.toFixed(2)),
      bulletinAverage: bulletinAverages[unit],
      difference: Number.parseFloat((data.average - bulletinAverages[unit]).toFixed(2)),
      match: Math.abs(data.average - bulletinAverages[unit]) < 0.1,
    })),
    generalAverage: {
      calculatedAverage: Number.parseFloat(generalAverage.toFixed(2)),
      bulletinAverage: bulletinAverages["Moyenne Générale"],
      difference: Number.parseFloat((generalAverage - bulletinAverages["Moyenne Générale"]).toFixed(2)),
      match: Math.abs(generalAverage - bulletinAverages["Moyenne Générale"]) < 0.1,
    },
    subjectAverages: Object.entries(subjectAverages).map(([subject, data]) => ({
      subject,
      calculatedAverage: Number.parseFloat(data.average.toFixed(2)),
      unit: data.unit,
    })),
  }

  return comparisonResults
}

// Fonction pour extraire les notes manuellement à partir des données fournies
export function extractManualGrades() {
  return [
    // Mathématiques 1
    {
      date: "23/09/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS1_01",
      name: "DS Mathématiques 1 n°1 S1",
      subject: "Mathématiques 1 S1",
      grade: 9.5,
      coefficient: 1,
      isWrittenExam: true,
    },
    {
      date: "04/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS1_CC",
      name: "Contrôle continu Mathématiques 1 S1",
      subject: "Mathématiques 1 S1",
      grade: 18.13,
      coefficient: 1,
      isContinuousAssessment: true,
    },
    {
      date: "04/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS1_PROJET",
      name: "Projet Mathématiques 1 S1",
      subject: "Mathématiques 1 S1",
      grade: 14.0,
      coefficient: 1,
      isProject: true,
    },

    // Mathématiques 2
    {
      date: "21/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS2_01",
      name: "DS Mathématiques 2 n°1 S1",
      subject: "Mathématiques 2 S1",
      grade: 10.0,
      coefficient: 4,
      isWrittenExam: true,
    },
    {
      date: "18/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS2_02",
      name: "DS Mathématiques 2 n°2 S1",
      subject: "Mathématiques 2 S1",
      grade: 8.75,
      coefficient: 5,
      isWrittenExam: true,
    },
    {
      date: "18/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS2_CC",
      name: "Contrôle continu Mathématiques 2 S1",
      subject: "Mathématiques 2 S1",
      grade: 18.89,
      coefficient: 3,
      isContinuousAssessment: true,
    },
    {
      date: "18/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS2_PROJET",
      name: "Projet Mathématiques 2 S1",
      subject: "Mathématiques 2 S1",
      grade: 14.0,
      coefficient: 8,
      isProject: true,
    },

    // Mathématiques 3
    {
      date: "09/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS3_01",
      name: "DS Mathématiques 3 n°1 S1",
      subject: "Mathématiques 3 S1",
      grade: 8.5,
      coefficient: 4,
      isWrittenExam: true,
    },
    {
      date: "13/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_MATHS3_02",
      name: "DS Mathématiques 3 n°2 S1",
      subject: "Mathématiques 3 S1",
      grade: 5.5,
      coefficient: 5,
      isWrittenExam: true,
    },
    {
      date: "08/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_MATHS3_CC",
      name: "Contrôle continu Mathématiques 3 S1",
      subject: "Mathématiques 3 S1",
      grade: 15.9,
      coefficient: 3,
      isContinuousAssessment: true,
    },
    {
      date: "16/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_MATHS3_PROJET",
      name: "Projet Mathématiques 3 S1",
      subject: "Mathématiques 3 S1",
      grade: 10.5,
      coefficient: 8,
      isProject: true,
    },

    // C Microcontrôleur et algorithmie 1
    {
      date: "07/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_INFO1_CARDUINO_01",
      name: "DS Informatique n°1 S1",
      subject: "C Microcontrôleur et algorithmie 1 S1",
      grade: 15.0,
      coefficient: 1,
      isWrittenExam: true,
    },
    {
      date: "08/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_INFO1_CARDUINO_CC",
      name: "Informatique S1",
      subject: "C Microcontrôleur et algorithmie 1 S1",
      grade: 9.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },

    // Web 1
    {
      date: "25/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_INFO1_WEB_CC",
      name: "Informatique S1",
      subject: "Web 1 S1",
      grade: 16.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },
    {
      date: "18/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_INFO1_WEB_01",
      name: "DS Informatique n°1 S1",
      subject: "Web 1 S1",
      grade: 0.0,
      coefficient: 2,
      isWrittenExam: true,
    },

    // Bureautique
    {
      date: "07/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_INFO1_BUREAUTIQUE_01",
      name: "Bureautique S1",
      subject: "Bureautique S1",
      grade: 13.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },

    // Electronique Numérique 1
    {
      date: "13/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_ELECNUM_01",
      name: "DS Elec Num S1",
      subject: "Electronique Numérique 1 S1",
      grade: 16.5,
      coefficient: 5,
      isWrittenExam: true,
    },
    {
      date: "18/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_ELECNUM_CC_01",
      name: "TP Elec Num S1",
      subject: "Electronique Numérique 1 S1",
      grade: 17.5,
      coefficient: 4,
      isContinuousAssessment: true,
    },
    {
      date: "09/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_ELECNUM_CC_02",
      name: "TP Elec Num S1",
      subject: "Electronique Numérique 1 S1",
      grade: 16.5,
      coefficient: 6,
      isContinuousAssessment: true,
    },
    {
      date: "20/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_ELECNUM_PROJET",
      name: "Projet Elec Num S1",
      subject: "Electronique Numérique 1 S1",
      grade: 18.0,
      coefficient: 5,
      isProject: true,
    },

    // Mécanique 1
    {
      date: "25/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_MECA_01",
      name: "DS Mécanique n°1 S1",
      subject: "Mécanique 1 S1",
      grade: 9.0,
      coefficient: 1,
      isWrittenExam: true,
    },
    {
      date: "06/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_MECA_02",
      name: "DS Mécanique n°2 S1",
      subject: "Mécanique 1 S1",
      grade: 9.0,
      coefficient: 2,
      isWrittenExam: true,
    },
    {
      date: "06/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_MECA_PROJET",
      name: "Projet Mécanique S1",
      subject: "Mécanique 1 S1",
      grade: 0.0,
      coefficient: 1,
      isProject: true,
    },

    // Machines-Outils
    {
      date: "21/10/2024",
      code: "2425_ADIMAKER_LILLE_A1_SCI1_MACHINESOUTILS",
      name: "Formations Machines-Outils",
      subject: "Machines-Outils S1",
      grade: 10.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },

    // Introduction à la pensée critique
    {
      date: "16/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_IPC_02",
      name: "Présentation S1",
      subject: "Introduction à la pensée critique S1",
      grade: 14.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },
    {
      date: "16/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_IPC_01",
      name: "Quiz actualités S1",
      subject: "Introduction à la pensée critique S1",
      grade: 11.5,
      coefficient: 1,
      isContinuousAssessment: true,
    },

    // Projet Professionnel et Personnel
    {
      date: "09/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_PPP_01",
      name: "Evaluation PPP - CV",
      subject: "Projet Professionnel et Personnel S1",
      grade: 18.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },
    {
      date: "09/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_PPP_02",
      name: "Evaluation PPP-pitch",
      subject: "Projet Professionnel et Personnel S1",
      grade: 17.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },

    // Anglais
    {
      date: "07/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_ANGLAIS_01",
      name: "Evaluation Anglais S1 - contrôle continu",
      subject: "Anglais S1",
      grade: 10.0,
      coefficient: 3,
      isContinuousAssessment: true,
    },
    {
      date: "07/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_ANGLAIS_02",
      name: "Evaluation Anglais S1 - Global Exam",
      subject: "Anglais S1",
      grade: 19.0,
      coefficient: 2,
      isContinuousAssessment: true,
    },
    {
      date: "07/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_ANGLAIS_01",
      name: "Evaluation Anglais S1 - TOEIC List",
      subject: "Anglais S1",
      grade: 10.2,
      coefficient: 5,
      isContinuousAssessment: true,
    },

    // Français
    {
      date: "12/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_FRANCAIS_01",
      name: "Inventer un objet",
      subject: "Français S1",
      grade: 16.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },
    {
      date: "12/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_FRANCAIS_02",
      name: "note de clarification",
      subject: "Français S1",
      grade: 14.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },
    {
      date: "12/11/2024",
      code: "2425_ADIMAKER_LILLE_A1_FHL1_FRANCAIS_03",
      name: "oral technique complexe",
      subject: "Français S1",
      grade: 14.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },

    // Projets Alpha
    {
      date: "17/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_PROJET1_ALPHA",
      name: "Projets ALPHA S1",
      subject: "Projets Alpha S1",
      grade: 13.33,
      coefficient: 1,
      isProject: true,
    },

    // Projets Beta
    {
      date: "17/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_PROJET1_BETA",
      name: "Projet BETA S1",
      subject: "Projets Beta S1",
      grade: 8.0,
      coefficient: 1,
      isProject: true,
    },

    // Projet Gamma
    {
      date: "07/01/2025",
      code: "2425_ADIMAKER_LILLE_A1_PROJET1_GAMMA",
      name: "Projet GAMMA S1",
      subject: "Projet Gamma S1",
      grade: 8.5,
      coefficient: 1,
      isProject: true,
    },

    // Gestion de projet
    {
      date: "02/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_PROJET1_GP_01",
      name: "Evaluation GP",
      subject: "Gestion de projet S1",
      grade: 13.25,
      coefficient: 2,
      isContinuousAssessment: true,
    },
    {
      date: "16/12/2024",
      code: "2425_ADIMAKER_LILLE_A1_PROJET1_GP_CC",
      name: "Contrôle continu GP",
      subject: "Gestion de projet S1",
      grade: 6.0,
      coefficient: 1,
      isContinuousAssessment: true,
    },
  ]
}

// Fonction pour afficher les résultats de la vérification
export function displayVerificationResults(results: any) {
  console.log("=== VÉRIFICATION DES CALCULS DE MOYENNES ===")

  console.log("\n--- MOYENNES PAR UE ---")
  results.unitAverages.forEach((result: any) => {
    console.log(
      `${result.unit}: ${result.calculatedAverage.toFixed(2)} (Bulletin: ${result.bulletinAverage.toFixed(2)}) - Différence: ${result.difference.toFixed(2)} - ${result.match ? "✓" : "✗"}`,
    )
  })

  console.log("\n--- MOYENNE GÉNÉRALE ---")
  console.log(
    `Calculée: ${results.generalAverage.calculatedAverage.toFixed(2)} (Bulletin: ${results.generalAverage.bulletinAverage.toFixed(2)}) - Différence: ${results.generalAverage.difference.toFixed(2)} - ${results.generalAverage.match ? "✓" : "✗"}`,
  )

  console.log("\n--- MOYENNES PAR MATIÈRE ---")
  results.subjectAverages.forEach((result: any) => {
    if (result.calculatedAverage > 0) {
      console.log(`${result.subject}: ${result.calculatedAverage.toFixed(2)} (UE: ${result.unit})`)
    }
  })

  return {
    unitAverages: results.unitAverages,
    generalAverage: results.generalAverage,
    subjectAverages: results.subjectAverages,
  }
}

// Exécuter la vérification
export function runVerification() {
  const manualGrades = extractManualGrades()
  const results = verifyGradeCalculations(manualGrades)
  return displayVerificationResults(results)
}

