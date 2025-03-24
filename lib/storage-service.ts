import type { StudentData } from "@/types/grades"

// Clé pour le stockage local
const STUDENT_DATA_KEY = "aditrack_student_data"

// Sauvegarder les données de l'étudiant
export const saveStudentData = (data: StudentData): void => {
  try {
    localStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving student data:", error)
  }
}

// Récupérer les données de l'étudiant
export const getStudentData = (): StudentData | null => {
  try {
    const data = localStorage.getItem(STUDENT_DATA_KEY)
    if (!data) return null
    return JSON.parse(data) as StudentData
  } catch (error) {
    console.error("Error getting student data:", error)
    return null
  }
}

// Supprimer les données de l'étudiant
export const clearStudentData = (): void => {
  try {
    localStorage.removeItem(STUDENT_DATA_KEY)
  } catch (error) {
    console.error("Error clearing student data:", error)
  }
}

// Exporter les données vers un fichier
export const exportDataToFile = (data: StudentData): void => {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportFileDefaultName = `aditrack_notes_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  } catch (error) {
    console.error("Error exporting data:", error)
  }
}

// Importer les données depuis un fichier
export const importDataFromFile = (file: File): Promise<StudentData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error("Failed to read file"))
          return
        }

        const data = JSON.parse(event.target.result as string) as StudentData
        saveStudentData(data)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}

