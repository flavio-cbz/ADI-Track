"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { extractDataFromPDF } from "@/lib/pdf-extractor"
import { Loader2, Upload, Plus, FileText, X, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface GradeUploaderProps {
  onDataProcessed: (data: any) => void
  isProcessing: boolean
  isSaving: boolean
}

export function GradeUploader({ onDataProcessed, isProcessing, isSaving }: GradeUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles])
        setError(null)
      } else {
        setError("Veuillez sélectionner des fichiers PDF")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => file.type === "application/pdf")

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles])
        setError(null)
      } else {
        setError("Veuillez sélectionner des fichiers PDF")
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleExtract = async () => {
    if (files.length === 0) {
      setError("Veuillez sélectionner au moins un fichier PDF")
      return
    }

    setIsExtracting(true)
    setProgress(0)
    setError(null)

    try {
      // Process files sequentially and merge data
      let mergedData: any = { grades: [] }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const data = await extractDataFromPDF(file)

        // For the first file, get student info
        if (i === 0) {
          mergedData = { ...data }
        } else {
          // For subsequent files, just merge the grades
          mergedData.grades = [...mergedData.grades, ...data.grades]
        }

        // Update progress
        setProgress(((i + 1) / files.length) * 100)
      }

      // Remove duplicate grades based on code
      const uniqueGrades = Array.from(new Map(mergedData.grades.map((grade: any) => [grade.code, grade])).values())

      mergedData.grades = uniqueGrades

      onDataProcessed(mergedData)
    } catch (error) {
      console.error("Error extracting data:", error)
      setError("Une erreur est survenue lors de l'extraction des données. Vérifiez que le format du PDF est correct.")
    } finally {
      setIsExtracting(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Import depuis Aurion</h2>
        <p className="text-muted-foreground">
          Importez votre relevé de notes PDF depuis Aurion pour calculer automatiquement vos moyennes
        </p>
        <div className="flex justify-center mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            Le fichier PDF doit être le relevé de notes officiel d'Aurion
          </Badge>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card
        className={`border-2 border-dashed p-10 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-input"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Glissez-déposez vos fichiers PDF ici</h3>
            <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner des fichiers</p>
          </div>
          <Label
            htmlFor="pdf-upload"
            className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sélectionner des fichiers
          </Label>
          <Input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium">
            {files.length} fichier{files.length > 1 ? "s" : ""} sélectionné{files.length > 1 ? "s" : ""}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm truncate max-w-[200px] md:max-w-[400px]">{file.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Supprimer</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => {
                const input = document.getElementById("pdf-upload") as HTMLInputElement
                if (input) input.click()
              }}
              variant="outline"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter d'autres fichiers
            </Button>

            <Button onClick={handleExtract} disabled={isExtracting || isProcessing || isSaving} className="w-full">
              {(isExtracting || isProcessing || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isExtracting
                ? "Extraction en cours..."
                : isProcessing
                  ? "Traitement en cours..."
                  : isSaving
                    ? "Enregistrement en cours..."
                    : "Extraire et traiter les données"}
            </Button>

            {isExtracting && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Traitement des fichiers ({Math.round(progress)}%)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

