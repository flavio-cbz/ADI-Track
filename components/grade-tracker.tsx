"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeUploader } from "@/components/grade-uploader"
import { GradeTable } from "@/components/grade-table"
import { GradeSummary } from "@/components/grade-summary"
import { Dashboard } from "@/components/dashboard"
import { useToast } from "@/hooks/use-toast"
import { processGradeData } from "@/lib/grade-processor"
import { saveStudentData, getStudentData, deleteStudentData } from "@/lib/database"
import { exportDataToFile, importDataFromFile } from "@/lib/storage-service"
import type { StudentData } from "@/types/grades"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Settings, Upload, Trash2, AlertCircle, FileText, HelpCircle } from "lucide-react"
import { InitialSetup } from "@/components/initial-setup"
import { CalculationSettings } from "@/components/calculation-settings"
import { StatsView } from "@/components/stats-view"
import { GoalsTracker } from "@/components/goals-tracker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function GradeTracker() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load student data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStudentData()
        if (data) {
          setStudentData(data)
          toast({
            title: "Données chargées",
            description: "Vos données ont été chargées depuis le stockage local.",
          })
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleDataProcessed = async (data: any) => {
    setIsProcessing(true)
    try {
      const processedData = processGradeData(data)
      setStudentData(processedData)

      // Save to local storage
      setIsSaving(true)
      await saveStudentData(processedData)
      setIsSaving(false)

      toast({
        title: "Données traitées avec succès",
        description: "Les notes ont été calculées et enregistrées.",
      })

      // Automatically switch to dashboard tab
      setActiveTab("dashboard")
    } catch (error) {
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement des données.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsProcessing(false)
      setIsSaving(false)
    }
  }

  const handleGradeUpdate = async (updatedData: StudentData) => {
    setIsSaving(true)
    try {
      saveStudentData(updatedData)
      setStudentData(updatedData)

      toast({
        title: "Notes mises à jour",
        description: "Vos modifications ont été enregistrées.",
      })
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde des données.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const data = await getStudentData()
      if (data) {
        setStudentData(data)
      }

      toast({
        title: "Données actualisées",
        description: "Les données ont été actualisées depuis le stockage local.",
      })
    } catch (error) {
      toast({
        title: "Erreur d'actualisation",
        description: "Une erreur est survenue lors de l'actualisation des données.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    if (!studentData) return

    exportDataToFile(studentData)

    toast({
      title: "Exportation réussie",
      description: "Vos données ont été exportées dans un fichier JSON.",
    })
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)

    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setImportError("Le fichier doit être au format JSON")
      return
    }

    setIsSaving(true)

    try {
      const importedData = await importDataFromFile(file)
      setStudentData(importedData)

      toast({
        title: "Importation réussie",
        description: "Vos données ont été importées avec succès.",
      })

      // Switch to dashboard tab
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Import error:", error)
      setImportError("Erreur lors de l'importation du fichier. Vérifiez que le format est correct.")

      toast({
        title: "Erreur d'importation",
        description: "Une erreur est survenue lors de l'importation des données.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClearData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.")) {
      try {
        deleteStudentData()
        setStudentData(null)

        toast({
          title: "Données supprimées",
          description: "Toutes vos données ont été supprimées avec succès.",
        })
      } catch (error) {
        console.error("Error clearing data:", error)

        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression des données.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSettingsUpdate = async (updatedSettings: any) => {
    setIsSaving(true)
    try {
      // Update calculation settings
      const updatedData = {
        ...studentData!,
        calculationSettings: updatedSettings,
      }

      // Recalculate grades with new settings
      const recalculatedData = processGradeData(updatedData, true)

      // Save updated data
      saveStudentData(recalculatedData)
      setStudentData(recalculatedData)

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de calcul ont été mis à jour et les notes recalculées.",
      })

      setShowSettings(false)
    } catch (error) {
      toast({
        title: "Erreur de mise à jour",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  // If no data is loaded yet and not loading, show initial setup
  if (!isLoading && !studentData) {
    return (
      <div className="space-y-6">
        <InitialSetup onDataProcessed={handleDataProcessed} isProcessing={isProcessing} isSaving={isSaving} />

        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium">Vous avez déjà des données ?</h3>
            <p className="text-muted-foreground">
              Si vous avez déjà exporté vos données auparavant, vous pouvez les importer ici pour récupérer votre suivi.
            </p>
            <div className="flex justify-center gap-2">
              <Button onClick={handleImportClick} variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Importer un fichier de données (.json)
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,application/json"
                className="hidden"
              />
            </div>
            {importError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showSettings ? (
        <CalculationSettings
          settings={studentData?.calculationSettings || {}}
          onUpdate={handleSettingsUpdate}
          onCancel={() => setShowSettings(false)}
          isSaving={isSaving}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {studentData ? `Notes de ${studentData.studentInfo.name}` : "ADITrack"}
              </h2>
              {studentData?.calculationSettings?.year && (
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  {studentData.calculationSettings.year === "ADI1" ? "1ère année" : "2ème année"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} disabled={!studentData}>
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Personnalisez les paramètres de calcul des moyennes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Card className="p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{studentData ? `ADITrack - Notes` : "Importez vos notes"}</h2>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualiser
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Recharger les données depuis le stockage local</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Données
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Gestion des données</DialogTitle>
                      <DialogDescription>
                        Exportez vos données pour les sauvegarder ou importez-les pour les restaurer.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Importer des données</h4>
                        <p className="text-sm text-muted-foreground">
                          Importez vos données depuis un fichier JSON précédemment exporté.
                        </p>
                        <div className="flex items-center gap-2">
                          <Button onClick={handleImportClick} variant="outline" className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Importer depuis un fichier JSON
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json,application/json"
                            className="hidden"
                          />
                        </div>
                        {importError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{importError}</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Exporter vos données</h4>
                        <p className="text-sm text-muted-foreground">
                          Exportez vos données actuelles dans un fichier JSON que vous pourrez réimporter
                          ultérieurement.
                        </p>
                        <Button onClick={exportData} disabled={!studentData} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Exporter mes données
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-destructive">Supprimer toutes les données</h4>
                        <p className="text-sm text-muted-foreground">
                          Cette action supprimera définitivement toutes vos données. Assurez-vous de les exporter avant
                          si nécessaire.
                        </p>
                        <Button onClick={handleClearData} variant="destructive" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer toutes mes données
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="dashboard" disabled={!studentData}>
                  Tableau de bord
                </TabsTrigger>
                <TabsTrigger value="upload">Importer des notes</TabsTrigger>
                <TabsTrigger value="grades" disabled={!studentData}>
                  Notes détaillées
                </TabsTrigger>
                <TabsTrigger value="summary" disabled={!studentData}>
                  Résumé
                </TabsTrigger>
                <TabsTrigger value="stats" disabled={!studentData}>
                  Statistiques avancées
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                {studentData && (
                  <div className="space-y-6">
                    <Dashboard studentData={studentData} classData={[studentData]} />
                    <GoalsTracker studentData={studentData} onUpdate={handleGradeUpdate} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">Importer vos notes depuis Aurion</h2>
                  <p className="text-muted-foreground">
                    Importez un ou plusieurs fichiers PDF contenant vos notes depuis Aurion pour suivre votre
                    progression.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-md mt-4 max-w-3xl mx-auto text-left">
                    <h4 className="font-medium mb-2">Comment obtenir votre relevé de notes</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Connectez-vous à votre espace Aurion</li>
                      <li>Accédez à la section "Scolarité" puis "Notes"</li>
                      <li>Cliquez sur le bouton "Imprimer" en haut à droite du relevé</li>
                      <li>Enregistrez le document au format PDF</li>
                      <li>Importez le fichier PDF ci-dessous</li>
                    </ol>
                  </div>
                </div>
                <GradeUploader onDataProcessed={handleDataProcessed} isProcessing={isProcessing} isSaving={isSaving} />
              </TabsContent>

              <TabsContent value="grades">
                {studentData && (
                  <GradeTable studentData={studentData} onUpdate={handleGradeUpdate} isSaving={isSaving} />
                )}
              </TabsContent>

              <TabsContent value="summary">
                {studentData && <GradeSummary studentData={studentData} classData={[studentData]} />}
              </TabsContent>

              <TabsContent value="stats">{studentData && <StatsView studentData={studentData} />}</TabsContent>
            </Tabs>
          </Card>
        </>
      )}
    </div>
  )
}

