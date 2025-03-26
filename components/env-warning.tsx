"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function EnvWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Check if JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET
    setShowWarning(!jwtSecret)
  }, [])

  if (!showWarning) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Variables d'environnement manquantes</AlertTitle>
      <AlertDescription>
        La variable d'environnement JWT_SECRET est manquante. L'application fonctionne en mode hors ligne avec des
        fonctionnalités limitées. Veuillez configurer JWT_SECRET.
      </AlertDescription>
    </Alert>
  )
}

