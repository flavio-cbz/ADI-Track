"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, FileDown, Eye } from "lucide-react"
import type { StudentData } from "@/types/grades"
import { generatePDF } from "@/lib/pdf-generator"
import { ReportPreview } from "@/components/report-preview"

interface GenerateReportProps {
  studentData: StudentData
}

export function GenerateReport({ studentData }: GenerateReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [reportOptions, setReportOptions] = useState({
    title: "Bulletin Semestriel",
    subtitle: `Semestre 1 - ${new Date().getFullYear()}`,
    includeCharts: true,
    includeDetailedGrades: true,
    teacherComment: "",
    signatureDate: new Date().toISOString().split("T")[0],
  })

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReportOptions((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setReportOptions((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await generatePDF(studentData, reportOptions)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Une erreur est survenue lors de la génération du PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Options du bulletin</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du bulletin</Label>
              <Input id="title" name="title" value={reportOptions.title} onChange={handleOptionChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input id="subtitle" name="subtitle" value={reportOptions.subtitle} onChange={handleOptionChange} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="includeCharts">Inclure les graphiques</Label>
              <Switch
                id="includeCharts"
                checked={reportOptions.includeCharts}
                onCheckedChange={(checked) => handleSwitchChange("includeCharts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="includeDetailedGrades">Inclure les notes détaillées</Label>
              <Switch
                id="includeDetailedGrades"
                checked={reportOptions.includeDetailedGrades}
                onCheckedChange={(checked) => handleSwitchChange("includeDetailedGrades", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherComment">Commentaire du professeur</Label>
              <Textarea
                id="teacherComment"
                name="teacherComment"
                value={reportOptions.teacherComment}
                onChange={handleOptionChange}
                rows={4}
                placeholder="Saisissez un commentaire pour l'étudiant..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signatureDate">Date de signature</Label>
              <Input
                id="signatureDate"
                name="signatureDate"
                type="date"
                value={reportOptions.signatureDate}
                onChange={handleOptionChange}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Aperçu du bulletin</h3>
          <div className="flex flex-col h-full">
            <div className="flex-grow mb-4">
              <div className="bg-slate-100 rounded-md p-4 h-64 flex items-center justify-center">
                {showPreview ? (
                  <ReportPreview studentData={studentData} options={reportOptions} />
                ) : (
                  <div className="text-center text-slate-500">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Cliquez sur "Aperçu" pour visualiser le bulletin</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="w-full">
                {showPreview ? "Masquer l'aperçu" : "Aperçu"}
              </Button>
              <Button onClick={handleGeneratePDF} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Télécharger le bulletin PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

