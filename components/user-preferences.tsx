"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateUserPreferences } from "@/lib/auth"
import type { User } from "@/types/auth"

interface UserPreferencesProps {
  user: User
  onUpdate: () => void
}

export function UserPreferences({ user, onUpdate }: UserPreferencesProps) {
  const [hideRanking, setHideRanking] = useState(user.hideRanking)
  const [year, setYear] = useState<"ADI1" | "ADI2">(user.year)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await updateUserPreferences({
        hideRanking,
        year,
      })

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        onUpdate()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue lors de la mise à jour des préférences" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences utilisateur</CardTitle>
        <CardDescription>Personnalisez votre expérience ADITrack</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type === "success" ? "default" : "destructive"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-ranking">Masquer le classement</Label>
              <p className="text-sm text-muted-foreground">
                Masque votre position dans le classement et celle des autres étudiants
              </p>
            </div>
            <Switch id="hide-ranking" checked={hideRanking} onCheckedChange={setHideRanking} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Année d'études</Label>
            <Select value={year} onValueChange={(value: "ADI1" | "ADI2") => setYear(value)}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Sélectionner votre année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADI1">ADI1 (1ère année)</SelectItem>
                <SelectItem value="ADI2">ADI2 (2ème année)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Les coefficients et matières sont différents selon l'année d'études. Changer d'année recalculera vos
              moyennes avec les coefficients appropriés.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading} className="ml-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

