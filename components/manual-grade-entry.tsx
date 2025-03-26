"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ManualGradeEntryProps {
  onDataProcessed: (data: any) => void
  isSaving: boolean
}

const studentInfoSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().optional(),
  ine: z.string().optional(),
  class: z.string().min(2, "La classe doit contenir au moins 2 caractères"),
  year: z.enum(["ADI1", "ADI2"]), // Add year field
})

const gradeSchema = z.object({
  date: z.string(),
  name: z.string().min(1, "Le nom de l'épreuve est requis"),
  subject: z.string().min(1, "La matière est requise"),
  grade: z.coerce.number().min(0, "La note doit être positive").max(20, "La note doit être inférieure ou égale à 20"),
  coefficient: z.coerce.number().min(0.1, "Le coefficient doit être positif"),
  type: z.enum(["written", "continuous", "project"]),
})

type StudentInfoFormValues = z.infer<typeof studentInfoSchema>
type GradeFormValues = z.infer<typeof gradeSchema>

export function ManualGradeEntry({ onDataProcessed, isSaving }: ManualGradeEntryProps) {
  const [grades, setGrades] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState<"info" | "grades">("info")
  const [error, setError] = useState<string | null>(null)

  const studentInfoForm = useForm<StudentInfoFormValues>({
    resolver: zodResolver(studentInfoSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      ine: "",
      class: "ADI1 2024-2025",
      year: "ADI1", // Add default year
    },
  })

  const gradeForm = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      name: "",
      subject: "",
      grade: 0,
      coefficient: 1,
      type: "continuous",
    },
  })

  const onStudentInfoSubmit = (data: StudentInfoFormValues) => {
    setCurrentStep("grades")
  }

  const onAddGrade = (data: GradeFormValues) => {
    // Convert type to boolean flags
    const gradeEntry = {
      ...data,
      isWrittenExam: data.type === "written",
      isContinuousAssessment: data.type === "continuous",
      isProject: data.type === "project",
      code: `MANUAL_${Date.now()}`,
    }

    // Add grade to list
    setGrades([...grades, gradeEntry])

    // Reset form
    gradeForm.reset({
      date: new Date().toISOString().split("T")[0],
      name: "",
      subject: "",
      grade: 0,
      coefficient: 1,
      type: "continuous",
    })
  }

  const removeGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (grades.length === 0) {
      setError("Veuillez ajouter au moins une note")
      return
    }

    const studentInfo = studentInfoForm.getValues()

    // Prepare data in the format expected by the processor
    const data = {
      studentName: studentInfo.name,
      birthDate: studentInfo.birthDate || "01/01/2000",
      ine: studentInfo.ine || "000000000AA",
      class: studentInfo.class,
      year: studentInfo.year, // Include the year
      rank: 1,
      grades: grades,
    }

    onDataProcessed(data)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentStep === "info" ? (
        <Form {...studentInfoForm}>
          <form onSubmit={studentInfoForm.handleSubmit(onStudentInfoSubmit)} className="space-y-4">
            <FormField
              control={studentInfoForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom NOM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={studentInfoForm.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentInfoForm.control}
                name="ine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro INE (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro INE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={studentInfoForm.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <FormControl>
                    <Input placeholder="ADI1 2024-2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={studentInfoForm.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année d'études</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner votre année" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADI1">ADI1 (1ère année)</SelectItem>
                      <SelectItem value="ADI2">ADI2 (2ème année)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Les coefficients et matières sont différents selon l'année d'études
                  </p>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continuer
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h3 className="font-medium">Informations étudiant</h3>
            <p className="text-sm text-muted-foreground">
              {studentInfoForm.getValues().name} - {studentInfoForm.getValues().class}
            </p>
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setCurrentStep("info")}>
              Modifier
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Ajouter une note</h3>
            <Form {...gradeForm}>
              <form onSubmit={gradeForm.handleSubmit(onAddGrade)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={gradeForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={gradeForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matière</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Mathématiques" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={gradeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'épreuve</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: DS Mathématiques n°1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={gradeForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="20" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={gradeForm.control}
                    name="coefficient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coefficient</FormLabel>
                        <FormControl>
                          <Input type="number" min="0.1" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={gradeForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'évaluation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type d'évaluation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="written">Épreuve écrite</SelectItem>
                            <SelectItem value="continuous">Contrôle continu</SelectItem>
                            <SelectItem value="project">Projet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter cette note
                </Button>
              </form>
            </Form>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="font-medium">Notes ajoutées ({grades.length})</h3>

            {grades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune note ajoutée. Utilisez le formulaire ci-dessus pour ajouter des notes.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {grades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{grade.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {grade.subject} - {grade.date} - Coef. {grade.coefficient}
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
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full" disabled={grades.length === 0 || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement en cours...
                </>
              ) : (
                "Enregistrer et calculer les moyennes"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

