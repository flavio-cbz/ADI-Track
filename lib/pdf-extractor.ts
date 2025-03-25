// Utilisation de PDF.js via CDN pour éviter les problèmes d'importation
// Cette fonction sera appelée uniquement côté client

// Type pour l'objet PDF.js global
declare global {
  interface Window {
    pdfjsLib: any
  }
}

// Fonction pour charger PDF.js depuis le CDN
const loadPdfJs = async (): Promise<void> => {
  if (typeof window === "undefined") {
    throw new Error("Cette fonction ne peut être exécutée que côté client")
  }

  // Vérifier si PDF.js est déjà chargé
  if (window.pdfjsLib) {
    return
  }

  // Charger le script principal de PDF.js
  const script = document.createElement("script")
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
  script.async = true

  // Attendre que le script soit chargé
  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Impossible de charger PDF.js"))
    document.head.appendChild(script)
  })

  // Configurer le worker
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js"
}

export async function extractDataFromPdf(file: File): Promise<any> {
  try {
    // Vérifier que nous sommes bien côté client
    if (typeof window === "undefined") {
      throw new Error("Cette fonction ne peut être exécutée que côté client")
    }

    // Charger PDF.js
    await loadPdfJs()

    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Charger le document PDF
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise

    // Informations de l'étudiant (à extraire de la première page)
    const studentInfo = {
      name: "",
      birthDate: "",
      ine: "",
      class: "",
      rank: 1,
    }

    // Tableau pour stocker les notes extraites
    const grades = []

    // Parcourir toutes les pages du document
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const text = textContent.items.map((item: any) => item.str).join(" ")

      // Extraire les informations de l'étudiant (généralement sur la première page)
      if (i === 1) {
        // Essayer d'extraire le nom de l'étudiant
        const nameMatch =
          text.match(/Nom\s*:\s*([^\n]+)/i) ||
          text.match(/Étudiant\s*:\s*([^\n]+)/i) ||
          text.match(/Monsieur\s+([^\n]+)/i)
        if (nameMatch) {
          studentInfo.name = nameMatch[1].trim()
        }

        // Essayer d'extraire la date de naissance
        const birthDateMatch =
          text.match(/Date de naissance\s*:\s*(\d{2}\/\d{2}\/\d{4})/i) || text.match(/Né le\s+(\d{2}\/\d{2}\/\d{4})/i)
        if (birthDateMatch) {
          studentInfo.birthDate = birthDateMatch[1]
        }

        // Essayer d'extraire le numéro INE
        const ineMatch = text.match(/INE\s*:\s*([0-9A-Z]+)/i)
        if (ineMatch) {
          studentInfo.ine = ineMatch[1]
        }

        // Essayer d'extraire la classe
        const classMatch =
          text.match(/Classe\s*:\s*([^\n]+)/i) ||
          text.match(/Formation\s*:\s*([^\n]+)/i) ||
          text.match(/Grade\s*([^\n]+)Rang/i)
        if (classMatch) {
          studentInfo.class = classMatch[1].trim()
        }

        // Essayer d'extraire le rang
        const rankMatch = text.match(/Rang\s*(\d+)\/(\d+)/i)
        if (rankMatch) {
          studentInfo.rank = Number.parseInt(rankMatch[1])
        }
      }

      // Extraire les notes du tableau
      // Rechercher les lignes qui contiennent des notes
      const lines = text.split("\n")

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j]

        // Vérifier si la ligne contient une date au format JJ/MM/YYYY
        const dateMatch = line.match(/(\d{2}\/\d{2}\/\d{4})/)
        if (dateMatch) {
          const date = dateMatch[1]

          // Essayer d'extraire le code de l'épreuve
          const codeMatch = line.match(/(\d{4}_ADIMAKER_[A-Z]+_A\d+_[A-Z0-9_]+)/)
          const code = codeMatch ? codeMatch[1] : `EXTRACTED_${Date.now()}`

          // Essayer d'extraire le nom de l'épreuve
          let name = ""
          let subject = ""
          let isWrittenExam = false
          let isContinuousAssessment = false
          let isProject = false

          // Rechercher des patterns communs dans les noms d'épreuves
          if (line.includes("DS ")) {
            const dsMatch = line.match(/DS\s+([^\d]+)\s*n°\d+\s*(S\d+)?/)
            if (dsMatch) {
              name = line.match(/DS\s+[^\n]+/)?.[0]?.trim() || ""
              subject = dsMatch[1]?.trim() || ""
              isWrittenExam = true
            }
          } else if (line.includes("Contrôle continu")) {
            const ccMatch = line.match(/Contrôle\s+continu\s+([^\n]+)/)
            if (ccMatch) {
              name = line.match(/Contrôle\s+continu\s+[^\n]+/)?.[0]?.trim() || ""
              subject = ccMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("Projet")) {
            const projetMatch = line.match(/Projet\s+([^\n]+)/)
            if (projetMatch) {
              name = line.match(/Projet\s+[^\n]+/)?.[0]?.trim() || ""
              subject = projetMatch[1]?.trim() || ""
              isProject = true
            }
          } else if (line.includes("Séminaire")) {
            const seminaireMatch = line.match(/Séminaire\s+([^\n]+)/)
            if (seminaireMatch) {
              name = line.match(/Séminaire\s+[^\n]+/)?.[0]?.trim() || ""
              subject = "Séminaire " + (seminaireMatch[1]?.trim() || "")
              isProject = true
            }
          } else if (line.includes("Evaluation")) {
            const evalMatch = line.match(/Evaluation\s+([^\n]+)/)
            if (evalMatch) {
              name = line.match(/Evaluation\s+[^\n]+/)?.[0]?.trim() || ""
              subject = evalMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("TP ")) {
            const tpMatch = line.match(/TP\s+([^\n]+)/)
            if (tpMatch) {
              name = line.match(/TP\s+[^\n]+/)?.[0]?.trim() || ""
              subject = tpMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("Quiz")) {
            const quizMatch = line.match(/Quiz\s+([^\n]+)/)
            if (quizMatch) {
              name = line.match(/Quiz\s+[^\n]+/)?.[0]?.trim() || ""
              subject = quizMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("oral")) {
            const oralMatch = line.match(/oral\s+([^\n]+)/)
            if (oralMatch) {
              name = line.match(/oral\s+[^\n]+/)?.[0]?.trim() || ""
              subject = oralMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("note de")) {
            const noteMatch = line.match(/note de\s+([^\n]+)/)
            if (noteMatch) {
              name = line.match(/note de\s+[^\n]+/)?.[0]?.trim() || ""
              subject = noteMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("Inventer")) {
            const inventerMatch = line.match(/Inventer\s+([^\n]+)/)
            if (inventerMatch) {
              name = line.match(/Inventer\s+[^\n]+/)?.[0]?.trim() || ""
              subject = inventerMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          } else if (line.includes("Formations")) {
            const formationsMatch = line.match(/Formations\s+([^\n]+)/)
            if (formationsMatch) {
              name = line.match(/Formations\s+[^\n]+/)?.[0]?.trim() || ""
              subject = formationsMatch[1]?.trim() || ""
              isContinuousAssessment = true
            }
          }

          // Si aucun pattern n'a été trouvé, essayer d'extraire le nom de l'épreuve de manière générique
          if (!name && !subject) {
            // Chercher le texte entre le code et la note
            const genericMatch = line.match(new RegExp(`${code}\\s+([^\\d]+)\\s+\\d+`))
            if (genericMatch) {
              name = genericMatch[1]?.trim() || ""
              subject = name
              // Par défaut, considérer comme contrôle continu
              isContinuousAssessment = true
            }
          }

          // Extraire le semestre (S1, S2, etc.)
          const semesterMatch = line.match(/S(\d+)/)
          const semester = semesterMatch ? semesterMatch[0] : ""

          // Si le semestre est trouvé, l'ajouter au nom du sujet
          if (semester && subject) {
            // Vérifier si le semestre est déjà dans le nom du sujet
            if (!subject.includes(semester)) {
              subject = subject.trim() + " " + semester
            }
          }

          // Extraire la note
          const gradeMatch = line.match(
            /\s(\d+[.,]\d+)\s+\d+[.,]?\d*\s+\d+[.,]?\d*\s+\d+[.,]?\d*\s+\d+[.,]?\d*\s+\d+[.,]?\d*/,
          )
          if (gradeMatch) {
            const grade = Number.parseFloat(gradeMatch[1].replace(",", "."))

            // Extraire le coefficient
            const coefficientMatch = line.match(
              /\s(\d+[.,]?\d*)\s+\d+[.,]?\d*\s+\d+[.,]?\d*\s+\d+[.,]?\d*\s+\d+[.,]?\d*/,
            )
            const coefficient = coefficientMatch ? Number.parseFloat(coefficientMatch[1].replace(",", ".")) : 1

            // Déterminer l'année d'études (ADI1 ou ADI2)
            const yearMatch = code.match(/_A(\d+)_/)
            const year = yearMatch && yearMatch[1] === "2" ? "ADI2" : "ADI1"

            // Déterminer l'UE à partir du code
            let unit = ""
            if (code.includes("_MATHS")) {
              unit =
                semester === "S1"
                  ? "Mathématiques 1"
                  : semester === "S2"
                    ? "Mathématiques 2"
                    : semester === "S3"
                      ? "Mathématiques 3"
                      : "Mathématiques 4"
            } else if (code.includes("_INFO")) {
              unit =
                semester === "S1"
                  ? "Informatique 1"
                  : semester === "S2"
                    ? "Informatique 2"
                    : semester === "S3"
                      ? "Informatique 3"
                      : "Informatique 4"
            } else if (code.includes("_SCI")) {
              unit =
                semester === "S1"
                  ? "Sciences 1"
                  : semester === "S2"
                    ? "Sciences 2"
                    : semester === "S3"
                      ? "Sciences 3"
                      : "Sciences 4"
            } else if (code.includes("_PROJET")) {
              unit =
                semester === "S1"
                  ? "Projet 1"
                  : semester === "S2"
                    ? "Projet 2"
                    : semester === "S3"
                      ? "Projet 3"
                      : "Projet 4"
            } else if (code.includes("_FHL")) {
              unit =
                semester === "S1"
                  ? "Humanités 1"
                  : semester === "S2"
                    ? "Humanités 2"
                    : semester === "S3"
                      ? "Humanités 3"
                      : "Humanités 4"
            }

            // Ajouter la note au tableau des notes
            if (subject && !isNaN(grade)) {
              grades.push({
                date,
                code,
                name,
                subject,
                grade,
                coefficient,
                isWrittenExam,
                isContinuousAssessment,
                isProject,
                year,
                unit,
              })
            }
          }
        }
      }
    }

    // Vérifier si des notes ont été extraites
    if (grades.length === 0) {
      throw new Error("Aucune note n'a été extraite du PDF. Le format du document n'est peut-être pas compatible.")
    }

    // Déterminer l'année d'études (ADI1 ou ADI2) en fonction des notes extraites
    const year = grades.length > 0 && grades.some((g) => g.year === "ADI2") ? "ADI2" : "ADI1"

    // Retourner les données extraites
    return {
      studentName: studentInfo.name,
      birthDate: studentInfo.birthDate,
      ine: studentInfo.ine,
      class: studentInfo.class,
      rank: studentInfo.rank,
      year,
      grades,
    }
  } catch (error: any) {
    console.error("Erreur lors de l'extraction des données du PDF:", error)
    throw new Error(`Erreur lors de l'extraction des données du PDF: ${error.message}`)
  }
}

// Fonction qui lance une erreur explicite
export function handleExtractionError(error: any): never {
  throw new Error(`L'extraction des données du PDF a échoué: ${error.message}`)
}

