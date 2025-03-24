"use server"

import type { StudentData } from "@/types/grades"
import * as storageService from "@/lib/storage-service"

// Sauvegarde les données de l'étudiant
export async function saveStudentData(data: StudentData) {
  try {
    // En environnement serveur, nous utilisons le stockage local
    // Dans un environnement de production réel, cela pourrait être une base de données
    if (typeof window !== "undefined") {
      storageService.saveStudentData(data)
    } else {
      // Stockage côté serveur (simulé pour cet exemple)
      global.studentData = data
    }

    return { success: true, message: "Données sauvegardées avec succès" }
  } catch (error) {
    console.error("Error saving student data:", error)
    return { success: false, message: "Erreur lors de la sauvegarde des données" }
  }
}

// Récupère les données de l'étudiant
export async function getStudentData() {
  try {
    // En environnement serveur, nous utilisons le stockage local
    if (typeof window !== "undefined") {
      return storageService.getStudentData()
    } else {
      // Stockage côté serveur (simulé pour cet exemple)
      return global.studentData || null
    }
  } catch (error) {
    console.error("Error getting student data:", error)
    return null
  }
}

// Récupère les données de tous les étudiants (pour la comparaison)
// Note: Dans cette implémentation simplifiée, nous n'avons accès qu'aux données de l'utilisateur actuel
export async function getAllStudentsData() {
  try {
    const data = await getStudentData()
    return data ? [data] : []
  } catch (error) {
    console.error("Error getting all students data:", error)
    return []
  }
}

// Supprime les données de l'étudiant
export async function deleteStudentData(userId?: string) {
  try {
    // Dans cette implémentation simplifiée, nous ignorons l'userId
    if (typeof window !== "undefined") {
      storageService.clearStudentData()
    } else {
      // Stockage côté serveur (simulé pour cet exemple)
      delete global.studentData
    }

    return { success: true, message: "Données supprimées avec succès" }
  } catch (error) {
    console.error("Error deleting student data:", error)
    return { success: false, message: "Erreur lors de la suppression des données" }
  }
}

