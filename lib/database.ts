"use client"

import type { StudentData } from "@/types/grades"
import * as storageService from "@/lib/storage-service"

// Save student data to local storage
export const saveStudentData = async (data: StudentData): Promise<void> => {
  try {
    // Sauvegarder les données dans le stockage local
    storageService.saveStudentData(data)
    console.log("Saved student data")
    return Promise.resolve()
  } catch (error) {
    console.error("Error saving student data:", error)
    return Promise.reject(error)
  }
}

// Get student data
export const getStudentData = async (): Promise<StudentData | null> => {
  try {
    // Récupérer les données depuis le stockage local
    return storageService.getStudentData()
  } catch (error) {
    console.error("Error getting student data:", error)
    return null
  }
}

// Get all students data (for summary comparison)
// Note: Dans cette implémentation simplifiée, nous n'avons accès qu'aux données de l'utilisateur actuel
export const getAllStudentsData = async (): Promise<StudentData[]> => {
  try {
    const data = storageService.getStudentData()
    return data ? [data] : []
  } catch (error) {
    console.error("Error getting all students data:", error)
    return []
  }
}

// Delete student data
export const deleteStudentData = async (): Promise<void> => {
  try {
    storageService.clearStudentData()
    return Promise.resolve()
  } catch (error) {
    console.error("Error deleting student data:", error)
    return Promise.reject(error)
  }
}

