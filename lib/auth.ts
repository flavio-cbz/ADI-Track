"use client"

import type { User } from "@/types/auth"
import Cookies from "js-cookie"

// Clé pour le cookie d'authentification
const AUTH_COOKIE_NAME = "aditrack_auth"

// Met à jour les préférences de l'utilisateur (côté client)
export async function updateUserPreferences(preferences: any) {
  try {
    // Récupérer l'utilisateur actuel
    const user = getCurrentUserClient()

    if (!user) {
      return { success: false, message: "Utilisateur non connecté" }
    }

    // Mettre à jour les préférences
    const updatedUser = {
      ...user,
      ...preferences,
    }

    // Sauvegarder l'utilisateur mis à jour
    Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(updatedUser), { expires: 7 })

    return { success: true, message: "Préférences mises à jour avec succès" }
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return { success: false, message: "Erreur lors de la mise à jour des préférences" }
  }
}

// Récupère l'utilisateur actuellement connecté (côté client)
export function getCurrentUserClient(): User | null {
  try {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME)

    if (!authCookie) {
      return null
    }

    return JSON.parse(authCookie) as User
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

