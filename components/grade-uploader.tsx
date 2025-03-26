"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X, AlertCircle, Search, Upload, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { extractDataFromPdf } from "@/lib/pdf-extractor"
import { Progress } from "@/components/ui/progress"

interface GradeUploaderProps {
  onDataProcessed: (data: any) => void
  isProcessing: boolean
  isSaving: boolean
}

// Subject lists based on the PDF document - Complete list from pages 4-5
const ADI1_SUBJECTS = [
  // Semestre 1
  {
    value: "mathematiques-1",
    label: "Mathématiques 1",
    coefficient: 4,
    unit: "Mathématiques 1",
    written: 33,
    continuous: 33,
    project: 34,
  },
  {
    value: "mathematiques-2",
    label: "Mathématiques 2",
    coefficient: 7,
    unit: "Mathématiques 1",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "mathematiques-3",
    label: "Mathématiques 3",
    coefficient: 9,
    unit: "Mathématiques 1",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "c-microcontroleur",
    label: "C Microcontrôleur et algorithmie 1",
    coefficient: 2,
    unit: "Informatique 1",
    written: 67,
    continuous: 33,
    project: 0,
  },
  {
    value: "bureautique",
    label: "Bureautique",
    coefficient: 1,
    unit: "Informatique 1",
    written: 0,
    continuous: 100,
    project: 0,
  },
  { value: "web-1", label: "Web 1", coefficient: 1, unit: "Informatique 1", written: 67, continuous: 33, project: 0 },
  {
    value: "mecanique-1",
    label: "Mécanique 1",
    coefficient: 1,
    unit: "Sciences 1",
    written: 75,
    continuous: 0,
    project: 25,
  },
  {
    value: "electronique-numerique-1",
    label: "Electronique Numérique 1",
    coefficient: 1,
    unit: "Sciences 1",
    written: 25,
    continuous: 50,
    project: 25,
  },
  {
    value: "machines-outils",
    label: "Machines-Outils",
    coefficient: 0,
    unit: "Sciences 1",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "projets-alpha-s1",
    label: "Projets Alpha (S1)",
    coefficient: 3,
    unit: "Projets 1",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projets-beta-s1",
    label: "Projets Beta (S1)",
    coefficient: 3,
    unit: "Projets 1",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projet-gamma-s1",
    label: "Projet Gamma (S1)",
    coefficient: 2,
    unit: "Projets 1",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "gestion-projet",
    label: "Gestion de projet",
    coefficient: 2,
    unit: "Projets 1",
    written: 67,
    continuous: 33,
    project: 0,
  },
  {
    value: "pensee-critique",
    label: "Introduction à la pensée critique",
    coefficient: 2,
    unit: "Humanités 1",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "projet-professionnel",
    label: "Projet Professionnel et Personnel",
    coefficient: 2,
    unit: "Humanités 1",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "communication-interculturelle-s1",
    label: "Communication interculturelle (S1)",
    coefficient: 1,
    unit: "Humanités 1",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "francais-s1",
    label: "Français (S1)",
    coefficient: 2,
    unit: "Humanités 1",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "anglais-s1",
    label: "Anglais (S1)",
    coefficient: 2,
    unit: "Humanités 1",
    written: 0,
    continuous: 100,
    project: 0,
  },

  // Semestre 2
  {
    value: "mathematiques-4",
    label: "Mathématiques 4",
    coefficient: 4,
    unit: "Mathématiques 2",
    written: 33,
    continuous: 33,
    project: 34,
  },
  {
    value: "mathematiques-5",
    label: "Mathématiques 5",
    coefficient: 7,
    unit: "Mathématiques 2",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "mathematiques-6",
    label: "Mathématiques 6",
    coefficient: 9,
    unit: "Mathématiques 2",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "algorithmie-2",
    label: "Algorithmie 2",
    coefficient: 2,
    unit: "Informatique 2",
    written: 67,
    continuous: 33,
    project: 0,
  },
  { value: "web-2", label: "Web 2", coefficient: 1, unit: "Informatique 2", written: 67, continuous: 33, project: 0 },
  {
    value: "electronique-numerique-2",
    label: "Electronique Numérique 2",
    coefficient: 3,
    unit: "Sciences 2",
    written: 45,
    continuous: 30,
    project: 25,
  },
  {
    value: "thermodynamique",
    label: "Thermodynamique",
    coefficient: 2,
    unit: "Sciences 2",
    written: 100,
    continuous: 0,
    project: 0,
  },
  {
    value: "mecanique-2",
    label: "Mécanique 2",
    coefficient: 3,
    unit: "Sciences 2",
    written: 75,
    continuous: 0,
    project: 25,
  },
  {
    value: "materiaux",
    label: "Matériaux",
    coefficient: 1,
    unit: "Sciences 2",
    written: 67,
    continuous: 0,
    project: 33,
  },
  {
    value: "projets-alpha-s2",
    label: "Projets Alpha (S2)",
    coefficient: 3,
    unit: "Projets 2",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projets-beta-s2",
    label: "Projets Beta (S2)",
    coefficient: 3,
    unit: "Projets 2",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projet-gamma-s2",
    label: "Projet Gamma (S2)",
    coefficient: 2,
    unit: "Projets 2",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "competences-relationnelles",
    label: "Compétences Relationnelles",
    coefficient: 2,
    unit: "Humanités 2",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "seminaire-creativite",
    label: "Séminaire créativité",
    coefficient: 2,
    unit: "Humanités 2",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "communication-interculturelle-s2",
    label: "Communication interculturelle (S2)",
    coefficient: 1,
    unit: "Humanités 2",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "francais-s2",
    label: "Français (S2)",
    coefficient: 2,
    unit: "Humanités 2",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "anglais-s2",
    label: "Anglais (S2)",
    coefficient: 2,
    unit: "Humanités 2",
    written: 0,
    continuous: 100,
    project: 0,
  },
]

const ADI2_SUBJECTS = [
  // Semestre 3
  {
    value: "mathematiques-7",
    label: "Mathématiques 7",
    coefficient: 5,
    unit: "Mathématiques 3",
    written: 33,
    continuous: 33,
    project: 34,
  },
  {
    value: "mathematiques-8",
    label: "Mathématiques 8",
    coefficient: 8,
    unit: "Mathématiques 3",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "mathematiques-9",
    label: "Mathématiques 9",
    coefficient: 7,
    unit: "Mathématiques 3",
    written: 45,
    continuous: 15,
    project: 40,
  },
  { value: "python", label: "Python", coefficient: 1, unit: "Informatique 3", written: 60, continuous: 40, project: 0 },
  {
    value: "histoire-technologies",
    label: "Histoire des Technologies Informatiques",
    coefficient: 1,
    unit: "Informatique 3",
    written: 50,
    continuous: 50,
    project: 0,
  },
  {
    value: "programmation-ia-1",
    label: "Programmation et IA 1",
    coefficient: 1,
    unit: "Informatique 3",
    written: 50,
    continuous: 50,
    project: 0,
  },
  {
    value: "electronique-analogique",
    label: "Electronique Analogique",
    coefficient: 1,
    unit: "Sciences 3",
    written: 100,
    continuous: 0,
    project: 0,
  },
  {
    value: "electronique-appliquee",
    label: "Electronique Appliquée",
    coefficient: 1,
    unit: "Sciences 3",
    written: 50,
    continuous: 0,
    project: 50,
  },
  {
    value: "automatique",
    label: "Automatique",
    coefficient: 1,
    unit: "Sciences 3",
    written: 75,
    continuous: 25,
    project: 0,
  },
  {
    value: "calcul-numerique",
    label: "Calcul numérique",
    coefficient: 1,
    unit: "Sciences 3",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "projets-alpha-s3",
    label: "Projets Alpha (S3)",
    coefficient: 3,
    unit: "Projets 3",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projets-beta-s3",
    label: "Projets Beta (S3)",
    coefficient: 3,
    unit: "Projets 3",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projet-gamma-s3",
    label: "Projet Gamma (S3)",
    coefficient: 2,
    unit: "Projets 3",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "competences-relationnelles-s3",
    label: "Compétences Relationnelles (S3)",
    coefficient: 2,
    unit: "Humanités 3",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "projet-professionnel-s3",
    label: "Projet Professionnel et Personnel (S3)",
    coefficient: 2,
    unit: "Humanités 3",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "communication-interculturelle-s3",
    label: "Communication interculturelle (S3)",
    coefficient: 1,
    unit: "Humanités 3",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "francais-s3",
    label: "Français (S3)",
    coefficient: 2,
    unit: "Humanités 3",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "anglais-s3",
    label: "Anglais (S3)",
    coefficient: 2,
    unit: "Humanités 3",
    written: 0,
    continuous: 100,
    project: 0,
  },

  // Semestre 4
  {
    value: "mathematiques-10",
    label: "Mathématiques 10",
    coefficient: 8,
    unit: "Mathématiques 4",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "mathematiques-11",
    label: "Mathématiques 11",
    coefficient: 7,
    unit: "Mathématiques 4",
    written: 45,
    continuous: 15,
    project: 40,
  },
  {
    value: "mathematiques-12",
    label: "Mathématiques 12",
    coefficient: 5,
    unit: "Mathématiques 4",
    written: 33,
    continuous: 33,
    project: 34,
  },
  {
    value: "electromagnetisme",
    label: "Electromagnétisme",
    coefficient: 1,
    unit: "Sciences 4",
    written: 100,
    continuous: 0,
    project: 0,
  },
  {
    value: "mecanique-ondes",
    label: "Mécanique des Ondes",
    coefficient: 1,
    unit: "Sciences 4",
    written: 100,
    continuous: 0,
    project: 0,
  },
  {
    value: "modelisation-assistee",
    label: "Modélisation Assistée par Ordinateur",
    coefficient: 1,
    unit: "Sciences 4",
    written: 0,
    continuous: 100,
    project: 0,
  },
  { value: "iot", label: "IoT", coefficient: 2, unit: "Informatique 4", written: 67, continuous: 33, project: 0 },
  {
    value: "programmation-ia-2",
    label: "Programmation et IA 2",
    coefficient: 1,
    unit: "Informatique 4",
    written: 50,
    continuous: 50,
    project: 0,
  },
  {
    value: "projets-alpha-s4",
    label: "Projets Alpha (S4)",
    coefficient: 3,
    unit: "Projets 4",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projets-beta-s4",
    label: "Projets Beta (S4)",
    coefficient: 3,
    unit: "Projets 4",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "projet-gamma-s4",
    label: "Projet Gamma (S4)",
    coefficient: 2,
    unit: "Projets 4",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "pensee-critique-s4",
    label: "Introduction à la pensée critique (S4)",
    coefficient: 2,
    unit: "Humanités 4",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "seminaire-eloquence",
    label: "Séminaire Eloquence et Rhétorique",
    coefficient: 2,
    unit: "Humanités 4",
    written: 0,
    continuous: 0,
    project: 100,
  },
  {
    value: "communication-interculturelle-s4",
    label: "Communication interculturelle (S4)",
    coefficient: 1,
    unit: "Humanités 4",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "francais-s4",
    label: "Français (S4)",
    coefficient: 2,
    unit: "Humanités 4",
    written: 0,
    continuous: 100,
    project: 0,
  },
  {
    value: "anglais-s4",
    label: "Anglais (S4)",
    coefficient: 2,
    unit: "Humanités 4",
    written: 0,
    continuous: 100,
    project: 0,
  },
  { value: "stage", label: "Stage", coefficient: 0, unit: "Stage", written: 0, continuous: 0, project: 100 },
]

// Teaching units with their ECTS credits
const TEACHING_UNITS_ADI1 = [
  { name: "Mathématiques 1", credits: 5 },
  { name: "Informatique 1", credits: 5 },
  { name: "Sciences 1", credits: 6 },
  { name: "Projets 1", credits: 8 },
  { name: "Humanités 1", credits: 6 },
  { name: "Mathématiques 2", credits: 5 },
  { name: "Informatique 2", credits: 4 },
  { name: "Sciences 2", credits: 7 },
  { name: "Projets 2", credits: 8 },
  { name: "Humanités 2", credits: 6 },
]

const TEACHING_UNITS_ADI2 = [
  { name: "Mathématiques 3", credits: 6 },
  { name: "Informatique 3", credits: 5 },
  { name: "Sciences 3", credits: 7 },
  { name: "Projets 3", credits: 6 },
  { name: "Humanités 3", credits: 6 },
  { name: "Mathématiques 4", credits: 6 },
  { name: "Sciences 4", credits: 5 },
  { name: "Informatique 4", credits: 5 },
  { name: "Projets 4", credits: 6 },
  { name: "Humanités 4", credits: 6 },
]

export function GradeUploader({ onDataProcessed, isProcessing, isSaving }: GradeUploaderProps) {
  const [activeTab, setActiveTab] = useState<string>("pdf")
  const [year, setYear] = useState<"ADI1" | "ADI2">("ADI1")
  const [studentName, setStudentName] = useState<string>("")
  const [birthDate, setBirthDate] = useState<string>("")
  const [ine, setIne] = useState<string>("")
  const [className, setClassName] = useState<string>("")
  const [grades, setGrades] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [subjectName, setSubjectName] = useState<string>("")
  const [grade, setGrade] = useState<string>("")
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [evaluationType, setEvaluationType] = useState<"written" | "continuous" | "project">("written")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get subjects based on selected year
  const subjects = year === "ADI1" ? ADI1_SUBJECTS : ADI2_SUBJECTS

  const handleAddGrade = () => {
    if (!selectedSubject || !grade || Number.parseFloat(grade) < 0 || Number.parseFloat(grade) > 20) {
      setError("Veuillez sélectionner une matière et entrer une note valide entre 0 et 20")
      return
    }

    const selectedSubjectData = subjects.find((s) => s.value === selectedSubject)
    if (!selectedSubjectData) {
      setError("Matière non trouvée")
      return
    }

    const newGrade = {
      date,
      code: `MANUAL_${Date.now()}`,
      name: `${evaluationType === "written" ? "DS" : evaluationType === "continuous" ? "CC" : "Projet"} ${selectedSubjectData.label}`,
      subject: selectedSubjectData.label,
      grade: Number.parseFloat(grade),
      coefficient: selectedSubjectData.coefficient,
      isWrittenExam: evaluationType === "written",
      isContinuousAssessment: evaluationType === "continuous",
      isProject: evaluationType === "project",
      unit: selectedSubjectData.unit,
      written: selectedSubjectData.written,
      continuous: selectedSubjectData.continuous,
      project: selectedSubjectData.project,
    }

    setGrades([...grades, newGrade])
    setSelectedSubject("")
    setSubjectName("")
    setGrade("")
    setError(null)
  }

  const removeGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!studentName) {
      setError("Veuillez entrer un nom d'étudiant")
      return
    }

    if (grades.length === 0) {
      setError("Veuillez ajouter au moins une note")
      return
    }

    const data = {
      studentName,
      birthDate: birthDate || "01/01/2000",
      ine: ine || "000000000XX",
      class: className || `${year} 2024-2025`,
      year,
      rank: 1,
      grades,
    }

    onDataProcessed(data)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (file.type !== "application/pdf") {
      setError("Veuillez sélectionner un fichier PDF")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    // Simuler une progression d'upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    try {
      // Extraire les données du PDF
      const extractedData = await extractDataFromPdf(file)

      // Mettre à jour la progression à 100%
      setUploadProgress(100)

      // Traiter les données
      onDataProcessed(extractedData)
    } catch (error: any) {
      console.error("Erreur lors de l'extraction des données:", error)
      setError(`Erreur lors de l'extraction des données: ${error.message}`)
      setUploadProgress(0)
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)

      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pdf">Import PDF</TabsTrigger>
          <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
        </TabsList>

        <TabsContent value="pdf" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Importer un relevé de notes PDF</h3>
              <p className="text-muted-foreground">
                Importez votre relevé de notes au format PDF pour extraire automatiquement vos notes.
              </p>

              <div className="space-y-2">
                <Label htmlFor="year-pdf">Année d'études</Label>
                <Select value={year} onValueChange={(value: "ADI1" | "ADI2") => setYear(value)}>
                  <SelectTrigger id="year-pdf">
                    <SelectValue placeholder="Sélectionner l'année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADI1">ADI1 (1ère année)</SelectItem>
                    <SelectItem value="ADI2">ADI2 (2ème année)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md border-muted-foreground/25 bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez-déposez votre fichier PDF ici ou cliquez pour parcourir
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading || isProcessing || isSaving}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isProcessing || isSaving}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Parcourir
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Traitement du PDF...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-2">Comment obtenir votre relevé de notes</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Connectez-vous à votre espace Aurion</li>
                  <li>Accédez à la section "Scolarité" puis "Notes"</li>
                  <li>Cliquez sur le bouton "Imprimer" en haut à droite du relevé</li>
                  <li>Enregistrez le document au format PDF</li>
                  <li>Importez le fichier PDF ci-dessus</li>
                </ol>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Seule l'extraction de données depuis des fichiers PDF réels est prise en charge.
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing || isSaving || isUploading}
                  className="mx-auto"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Sélectionner un fichier PDF
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations de l'étudiant</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Nom de l'étudiant</Label>
                  <Input
                    id="student-name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Prénom NOM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth-date">Date de naissance</Label>
                  <Input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ine">Numéro INE</Label>
                  <Input id="ine" value={ine} onChange={(e) => setIne(e.target.value)} placeholder="Numéro INE" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class-name">Classe</Label>
                  <Input
                    id="class-name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder={`${year} 2024-2025`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Année d'études</Label>
                  <Select value={year} onValueChange={(value: "ADI1" | "ADI2") => setYear(value)}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Sélectionner l'année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADI1">ADI1 (1ère année)</SelectItem>
                      <SelectItem value="ADI2">ADI2 (2ème année)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ajouter une note</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Matière</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {selectedSubject
                          ? subjects.find((subject) => subject.value === selectedSubject)?.label
                          : "Sélectionner une matière..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher une matière..." />
                        <CommandEmpty>Aucune matière trouvée.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {subjects.map((subject) => (
                              <CommandItem
                                key={subject.value}
                                value={subject.value}
                                onSelect={(currentValue) => {
                                  setSelectedSubject(currentValue === selectedSubject ? "" : currentValue)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedSubject === subject.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {subject.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Note (sur 20)</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evaluation-type">Type d'évaluation</Label>
                  <Select
                    value={evaluationType}
                    onValueChange={(value: "written" | "continuous" | "project") => setEvaluationType(value)}
                  >
                    <SelectTrigger id="evaluation-type">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="written">Épreuve écrite</SelectItem>
                      <SelectItem value="continuous">Contrôle continu</SelectItem>
                      <SelectItem value="project">Projet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddGrade} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter cette note
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </Card>

          {grades.length > 0 && (
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes ajoutées ({grades.length})</h3>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {grades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">{grade.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {grade.name} - {grade.date} - Coef. {grade.coefficient}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-bold">{grade.grade.toFixed(2)}/20</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeGrade(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleSubmit} className="w-full" disabled={isProcessing || isSaving}>
                  {isProcessing || isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isProcessing ? "Traitement en cours..." : "Enregistrement en cours..."}
                    </>
                  ) : (
                    "Calculer les moyennes"
                  )}
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

