"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeUploader } from "@/components/grade-uploader"
import { GradeTable } from "@/components/grade-table"
import { GradeSummary } from "@/components/grade-summary"
import { GenerateReport } from "@/components/generate-report"
import { useToast } from "@/hooks/use-toast"
import { processGradeData } from "@/lib/grade-processor"
import type { StudentData } from "@/types/grades"

export function GradeCalculator() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleDataProcessed = (data: any) => {
    setIsProcessing(true)
    try {
      const processedData = processGradeData(data)
      setStudentData(processedData)
      toast({
        title: "Données traitées avec succès",
        description: "Les notes ont été calculées selon les coefficients du guide de formation.",
      })
    } catch (error) {
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement des données.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="upload">Importer les données</TabsTrigger>
          <TabsTrigger value="grades" disabled={!studentData}>
            Notes détaillées
          </TabsTrigger>
          <TabsTrigger value="summary" disabled={!studentData}>
            Résumé des moyennes
          </TabsTrigger>
          <TabsTrigger value="report" disabled={!studentData}>
            Générer le bulletin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Importer les données des notes</h2>
            <p className="text-slate-600">
              Importez le fichier PDF contenant les notes des étudiants pour calculer les moyennes selon les
              coefficients du guide de formation.
            </p>
          </div>
          <GradeUploader onDataProcessed={handleDataProcessed} isProcessing={isProcessing} />
        </TabsContent>

        <TabsContent value="grades">{studentData && <GradeTable studentData={studentData} />}</TabsContent>

        <TabsContent value="summary">{studentData && <GradeSummary studentData={studentData} />}</TabsContent>

        <TabsContent value="report">{studentData && <GenerateReport studentData={studentData} />}</TabsContent>
      </Tabs>
    </Card>
  )
}

