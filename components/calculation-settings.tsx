"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, Save, X, Edit2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalculationSettingsProps {
  settings: any
  onUpdate: (settings: any) => void
  onCancel: () => void
  isSaving: boolean
}

export function CalculationSettings({ settings, onUpdate, onCancel, isSaving }: CalculationSettingsProps) {
  const [activeTab, setActiveTab] = useState<string>("units")
  const [localSettings, setLocalSettings] = useState(() => {
    // Determine which year's mappings to use
    const year = settings.year || "ADI1"

    // Use the appropriate mappings based on the year
    const defaultCourseToUnitMapping =
      year === "ADI1"
        ? {
            "Mathématiques 1": "Mathématiques",
            "Mathématiques 2": "Mathématiques",
            "Mathématiques 3": "Mathématiques",
            "C Microcontrôleur et algorithmie 1": "Informatique",
            Bureautique: "Informatique",
            "Web 1": "Informatique",
            "Mécanique 1": "Sciences",
            "Electronique Numérique 1": "Sciences",
            "Machines-Outils": "Sciences",
            "Projets Alpha": "Projets",
            "Projets Beta": "Projets",
            "Projet Gamma": "Projets",
            "Gestion de projet": "Projets",
            "Introduction à la pensée critique": "Humanités",
            "Projet Professionnel et Personnel": "Humanités",
            "Communication interculturelle": "Humanités",
            Français: "Humanités",
            Anglais: "Humanités",
          }
        : {
            "Mathématiques 4": "Mathématiques Avancées",
            "Mathématiques 5": "Mathématiques Avancées",
            Statistiques: "Mathématiques Avancées",
            "Programmation Orientée Objet": "Informatique Avancée",
            "Bases de données": "Informatique Avancée",
            "Web 2": "Informatique Avancée",
            "Mécanique 2": "Sciences Appliquées",
            "Electronique Numérique 2": "Sciences Appliquées",
            "Systèmes embarqués": "Sciences Appliquées",
            "Projet Innovation": "Projets Professionnels",
            "Projet Entreprise": "Projets Professionnels",
            Stage: "Projets Professionnels",
            "Management de projet": "Projets Professionnels",
            "Éthique et technologie": "Humanités et Langues",
            "Communication professionnelle": "Humanités et Langues",
            "Anglais professionnel": "Humanités et Langues",
          }

    return {
      courseToUnitMapping: settings.courseToUnitMapping || defaultCourseToUnitMapping,
      unitCreditsMapping:
        settings.unitCreditsMapping ||
        (year === "ADI1"
          ? {
              Mathématiques: 5,
              Informatique: 5,
              Sciences: 6,
              Projets: 8,
              Humanités: 6,
            }
          : {
              "Mathématiques Avancées": 6,
              "Informatique Avancée": 8,
              "Sciences Appliquées": 6,
              "Projets Professionnels": 10,
              "Humanités et Langues": 5,
            }),
      courseCoefficientsMapping: settings.courseCoefficientsMapping || defaultCourseToUnitMapping,
      evaluationWeights: settings.evaluationWeights || {},
      passingGrade: settings.passingGrade || 10,
      useCompensation: settings.useCompensation !== undefined ? settings.useCompensation : true,
      compensationThreshold: settings.compensationThreshold || 8,
      year: settings.year || "ADI1", // Add year to settings
    }
  })

  const [newUnit, setNewUnit] = useState({ name: "", credits: 0 })
  const [editingUnit, setEditingUnit] = useState<{ name: string; originalName: string; credits: number } | null>(null)
  const [newCourse, setNewCourse] = useState({ name: "", unit: "", coefficient: 1 })
  const [editingCourse, setEditingCourse] = useState<{
    name: string
    originalName: string
    unit: string
    coefficient: number
  } | null>(null)
  const [newMapping, setNewMapping] = useState({ course: "", unit: "" })
  const [newWeight, setNewWeight] = useState({
    course: "",
    written: 33,
    continuous: 33,
    project: 34,
  })

  const [error, setError] = useState<string | null>(null)

  const handleAddUnit = () => {
    if (!newUnit.name) {
      setError("Le nom de l'UE est requis")
      return
    }

    setLocalSettings({
      ...localSettings,
      unitCreditsMapping: {
        ...localSettings.unitCreditsMapping,
        [newUnit.name]: newUnit.credits,
      },
    })

    setNewUnit({ name: "", credits: 0 })
    setError(null)
  }

  const handleEditUnit = () => {
    if (!editingUnit || !editingUnit.name) {
      return
    }

    const updatedUnitCredits = { ...localSettings.unitCreditsMapping }

    // Remove old key if name changed
    if (editingUnit.originalName !== editingUnit.name) {
      delete updatedUnitCredits[editingUnit.originalName]

      // Update course mappings to point to the new unit name
      const updatedCourseToUnit = { ...localSettings.courseToUnitMapping }
      Object.keys(updatedCourseToUnit).forEach((course) => {
        if (updatedCourseToUnit[course] === editingUnit.originalName) {
          updatedCourseToUnit[course] = editingUnit.name
        }
      })

      setLocalSettings({
        ...localSettings,
        unitCreditsMapping: {
          ...updatedUnitCredits,
          [editingUnit.name]: editingUnit.credits,
        },
        courseToUnitMapping: updatedCourseToUnit,
      })
    } else {
      // Just update credits
      setLocalSettings({
        ...localSettings,
        unitCreditsMapping: {
          ...updatedUnitCredits,
          [editingUnit.name]: editingUnit.credits,
        },
      })
    }

    setEditingUnit(null)
  }

  const handleRemoveUnit = (unitName: string) => {
    const updatedUnitCredits = { ...localSettings.unitCreditsMapping }
    delete updatedUnitCredits[unitName]

    // Also remove all course mappings for this unit
    const updatedCourseToUnit = { ...localSettings.courseToUnitMapping }
    Object.keys(updatedCourseToUnit).forEach((course) => {
      if (updatedCourseToUnit[course] === unitName) {
        delete updatedCourseToUnit[course]
      }
    })

    setLocalSettings({
      ...localSettings,
      unitCreditsMapping: updatedUnitCredits,
      courseToUnitMapping: updatedCourseToUnit,
    })
  }

  const handleAddCourse = () => {
    if (!newCourse.name) {
      setError("Le nom du cours est requis")
      return
    }

    if (!newCourse.unit) {
      setError("L'UE du cours est requise")
      return
    }

    setLocalSettings({
      ...localSettings,
      courseCoefficientsMapping: {
        ...localSettings.courseCoefficientsMapping,
        [newCourse.name]: newCourse.coefficient,
      },
      courseToUnitMapping: {
        ...localSettings.courseToUnitMapping,
        [newCourse.name]: newCourse.unit,
      },
    })

    setNewCourse({ name: "", unit: "", coefficient: 1 })
    setError(null)
  }

  const handleEditCourse = () => {
    if (!editingCourse || !editingCourse.name) {
      return
    }

    const updatedCoefficients = { ...localSettings.courseCoefficientsMapping }
    const updatedMapping = { ...localSettings.courseToUnitMapping }

    // Remove old entries if name changed
    if (editingCourse.originalName !== editingCourse.name) {
      delete updatedCoefficients[editingCourse.originalName]
      delete updatedMapping[editingCourse.originalName]
    }

    // Add updated entries
    updatedCoefficients[editingCourse.name] = editingCourse.coefficient
    updatedMapping[editingCourse.name] = editingCourse.unit

    setLocalSettings({
      ...localSettings,
      courseCoefficientsMapping: updatedCoefficients,
      courseToUnitMapping: updatedMapping,
    })

    setEditingCourse(null)
  }

  const handleRemoveCourse = (courseName: string) => {
    const updatedCoefficients = { ...localSettings.courseCoefficientsMapping }
    delete updatedCoefficients[courseName]

    const updatedMapping = { ...localSettings.courseToUnitMapping }
    delete updatedMapping[courseName]

    const updatedWeights = { ...localSettings.evaluationWeights }
    delete updatedWeights[courseName]

    setLocalSettings({
      ...localSettings,
      courseCoefficientsMapping: updatedCoefficients,
      courseToUnitMapping: updatedMapping,
      evaluationWeights: updatedWeights,
    })
  }

  const handleAddMapping = () => {
    if (!newMapping.course || !newMapping.unit) {
      setError("Le cours et l'UE sont requis")
      return
    }

    setLocalSettings({
      ...localSettings,
      courseToUnitMapping: {
        ...localSettings.courseToUnitMapping,
        [newMapping.course]: newMapping.unit,
      },
    })

    setNewMapping({ course: "", unit: "" })
    setError(null)
  }

  const handleAddWeight = () => {
    if (!newWeight.course) {
      setError("Le cours est requis")
      return
    }

    const total = newWeight.written + newWeight.continuous + newWeight.project
    if (total !== 100) {
      setError("La somme des pondérations doit être égale à 100%")
      return
    }

    setLocalSettings({
      ...localSettings,
      evaluationWeights: {
        ...localSettings.evaluationWeights,
        [newWeight.course]: {
          written: newWeight.written,
          continuous: newWeight.continuous,
          project: newWeight.project,
        },
      },
    })

    setNewWeight({ course: "", written: 33, continuous: 33, project: 34 })
    setError(null)
  }

  const handleSave = () => {
    onUpdate(localSettings)
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Paramètres de calcul</CardTitle>
        <CardDescription>Personnalisez les paramètres de calcul des moyennes et des crédits ECTS</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="units">Unités d'enseignement</TabsTrigger>
            <TabsTrigger value="courses">Cours et coefficients</TabsTrigger>
            <TabsTrigger value="general">Paramètres généraux</TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Unités d'enseignement (UE)</h3>
              <p className="text-sm text-muted-foreground">
                Définissez les unités d'enseignement et leurs crédits ECTS
              </p>

              {editingUnit ? (
                <div className="space-y-4 border p-4 rounded-md bg-muted/30">
                  <h4 className="font-medium">Modifier une UE</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-unit-name">Nom de l'UE</Label>
                      <Input
                        id="edit-unit-name"
                        value={editingUnit.name}
                        onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-unit-credits">Crédits ECTS</Label>
                      <Input
                        id="edit-unit-credits"
                        type="number"
                        min="0"
                        value={editingUnit.credits}
                        onChange={(e) =>
                          setEditingUnit({ ...editingUnit, credits: Number.parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingUnit(null)}>
                      Annuler
                    </Button>
                    <Button onClick={handleEditUnit}>Enregistrer</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-unit-name">Nom de l'UE</Label>
                    <Input
                      id="new-unit-name"
                      value={newUnit.name}
                      onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                      placeholder="Ex: Mathématiques"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-unit-credits">Crédits ECTS</Label>
                    <Input
                      id="new-unit-credits"
                      type="number"
                      min="0"
                      value={newUnit.credits}
                      onChange={(e) => setNewUnit({ ...newUnit, credits: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}

              {!editingUnit && (
                <Button onClick={handleAddUnit} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une UE
                </Button>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">UE configurées</h4>
                {Object.keys(localSettings.unitCreditsMapping).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune UE configurée</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(localSettings.unitCreditsMapping).map(([unitName, credits]) => (
                      <div key={unitName} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div>
                          <span className="font-medium">{unitName}</span>
                          <span className="text-sm text-muted-foreground ml-2">({credits} ECTS)</span>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary"
                            onClick={() =>
                              setEditingUnit({ name: unitName, originalName: unitName, credits: Number(credits) })
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveUnit(unitName)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cours et coefficients</h3>
              <p className="text-sm text-muted-foreground">
                Définissez les cours, leurs coefficients et leurs UE de rattachement
              </p>

              {editingCourse ? (
                <div className="space-y-4 border p-4 rounded-md bg-muted/30">
                  <h4 className="font-medium">Modifier un cours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-course-name">Nom du cours</Label>
                      <Input
                        id="edit-course-name"
                        value={editingCourse.name}
                        onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-course-coefficient">Coefficient</Label>
                      <Input
                        id="edit-course-coefficient"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={editingCourse.coefficient}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, coefficient: Number.parseFloat(e.target.value) || 1 })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-course-unit">UE de rattachement</Label>
                    <select
                      id="edit-course-unit"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editingCourse.unit}
                      onChange={(e) => setEditingCourse({ ...editingCourse, unit: e.target.value })}
                    >
                      <option value="">Sélectionner une UE</option>
                      {Object.keys(localSettings.unitCreditsMapping).map((unitName) => (
                        <option key={unitName} value={unitName}>
                          {unitName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingCourse(null)}>
                      Annuler
                    </Button>
                    <Button onClick={handleEditCourse}>Enregistrer</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="new-course-name">Nom du cours</Label>
                      <Input
                        id="new-course-name"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                        placeholder="Ex: Algèbre linéaire"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-course-coefficient">Coefficient</Label>
                      <Input
                        id="new-course-coefficient"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={newCourse.coefficient}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, coefficient: Number.parseFloat(e.target.value) || 1 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-course-unit">UE de rattachement</Label>
                    <select
                      id="new-course-unit"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newCourse.unit}
                      onChange={(e) => setNewCourse({ ...newCourse, unit: e.target.value })}
                    >
                      <option value="">Sélectionner une UE</option>
                      {Object.keys(localSettings.unitCreditsMapping).map((unitName) => (
                        <option key={unitName} value={unitName}>
                          {unitName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button onClick={handleAddCourse} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un cours
                  </Button>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Cours configurés</h4>
                {Object.keys(localSettings.courseCoefficientsMapping).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun cours configuré</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(localSettings.courseCoefficientsMapping).map(([courseName, coefficient]) => (
                      <div key={courseName} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div>
                          <span className="font-medium">{courseName}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            (Coef. {coefficient}, UE: {localSettings.courseToUnitMapping[courseName] || "Non définie"})
                          </span>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary"
                            onClick={() =>
                              setEditingCourse({
                                name: courseName,
                                originalName: courseName,
                                coefficient: Number(coefficient),
                                unit: localSettings.courseToUnitMapping[courseName] || "",
                              })
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveCourse(courseName)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Pondération des types d'évaluation</h4>
                <p className="text-sm text-muted-foreground">
                  Définissez la pondération des différents types d'évaluation pour chaque cours
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-weight-course">Cours</Label>
                    <select
                      id="new-weight-course"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newWeight.course}
                      onChange={(e) => setNewWeight({ ...newWeight, course: e.target.value })}
                    >
                      <option value="">Sélectionner un cours</option>
                      {Object.keys(localSettings.courseCoefficientsMapping).map((courseName) => (
                        <option key={courseName} value={courseName}>
                          {courseName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="new-weight-written">Épreuves écrites (%)</Label>
                    <Input
                      id="new-weight-written"
                      type="number"
                      min="0"
                      max="100"
                      value={newWeight.written}
                      onChange={(e) => setNewWeight({ ...newWeight, written: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-weight-continuous">Contrôle continu (%)</Label>
                    <Input
                      id="new-weight-continuous"
                      type="number"
                      min="0"
                      max="100"
                      value={newWeight.continuous}
                      onChange={(e) => setNewWeight({ ...newWeight, continuous: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-weight-project">Projets (%)</Label>
                    <Input
                      id="new-weight-project"
                      type="number"
                      min="0"
                      max="100"
                      value={newWeight.project}
                      onChange={(e) => setNewWeight({ ...newWeight, project: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Total: {newWeight.written + newWeight.continuous + newWeight.project}%
                  {newWeight.written + newWeight.continuous + newWeight.project !== 100 && " (doit être égal à 100%)"}
                </div>

                <Button onClick={handleAddWeight} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Définir la pondération
                </Button>

                <div className="space-y-2">
                  <h4 className="font-medium">Pondérations configurées</h4>
                  {Object.keys(localSettings.evaluationWeights).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune pondération configurée</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(localSettings.evaluationWeights).map(([courseName, weights]: [string, any]) => (
                        <div key={courseName} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                          <div>
                            <span className="font-medium">{courseName}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              (Écrit: {weights.written}%, CC: {weights.continuous}%, Projet: {weights.project}%)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              const updatedWeights = { ...localSettings.evaluationWeights }
                              delete updatedWeights[courseName]
                              setLocalSettings({
                                ...localSettings,
                                evaluationWeights: updatedWeights,
                              })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Paramètres généraux</h3>
              <p className="text-sm text-muted-foreground">
                Définissez les règles générales de calcul des moyennes et de validation des UE
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-base font-semibold">
                    Année d'études
                  </Label>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Important</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Changer d'année modifiera les coefficients et matières par défaut. Vos notes seront recalculées en
                      conséquence.
                    </p>
                  </div>
                  <Select
                    value={localSettings.year}
                    onValueChange={(value) => {
                      // Réinitialiser les mappings par défaut en fonction de l'année
                      const defaultCourseToUnitMapping =
                        value === "ADI1"
                          ? {
                              "Mathématiques 1": "Mathématiques",
                              "Mathématiques 2": "Mathématiques",
                              "Mathématiques 3": "Mathématiques",
                              "C Microcontrôleur et algorithmie 1": "Informatique",
                              Bureautique: "Informatique",
                              "Web 1": "Informatique",
                              "Mécanique 1": "Sciences",
                              "Electronique Numérique 1": "Sciences",
                              "Machines-Outils": "Sciences",
                              "Projets Alpha": "Projets",
                              "Projets Beta": "Projets",
                              "Projet Gamma": "Projets",
                              "Gestion de projet": "Projets",
                              "Introduction à la pensée critique": "Humanités",
                              "Projet Professionnel et Personnel": "Humanités",
                              "Communication interculturelle": "Humanités",
                              Français: "Humanités",
                              Anglais: "Humanités",
                            }
                          : {
                              "Mathématiques 4": "Mathématiques Avancées",
                              "Mathématiques 5": "Mathématiques Avancées",
                              Statistiques: "Mathématiques Avancées",
                              "Programmation Orientée Objet": "Informatique Avancée",
                              "Bases de données": "Informatique Avancée",
                              "Web 2": "Informatique Avancée",
                              "Mécanique 2": "Sciences Appliquées",
                              "Electronique Numérique 2": "Sciences Appliquées",
                              "Systèmes embarqués": "Sciences Appliquées",
                              "Projet Innovation": "Projets Professionnels",
                              "Projet Entreprise": "Projets Professionnels",
                              Stage: "Projets Professionnels",
                              "Management de projet": "Projets Professionnels",
                              "Éthique et technologie": "Humanités et Langues",
                              "Communication professionnelle": "Humanités et Langues",
                              "Anglais professionnel": "Humanités et Langues",
                            }

                      const defaultUnitCreditsMapping =
                        value === "ADI1"
                          ? {
                              Mathématiques: 5,
                              Informatique: 5,
                              Sciences: 6,
                              Projets: 8,
                              Humanités: 6,
                            }
                          : {
                              "Mathématiques Avancées": 6,
                              "Informatique Avancée": 8,
                              "Sciences Appliquées": 6,
                              "Projets Professionnels": 10,
                              "Humanités et Langues": 5,
                            }

                      const defaultCourseCoefficientsMapping =
                        value === "ADI1"
                          ? {
                              "Mathématiques 1": 4,
                              "Mathématiques 2": 7,
                              "Mathématiques 3": 9,
                              "C Microcontrôleur et algorithmie 1": 2,
                              Bureautique: 1,
                              "Web 1": 1,
                              "Mécanique 1": 1,
                              "Electronique Numérique 1": 1,
                              "Machines-Outils": 0,
                              "Projets Alpha": 3,
                              "Projets Beta": 3,
                              "Projet Gamma": 2,
                              "Gestion de projet": 2,
                              "Introduction à la pensée critique": 2,
                              "Projet Professionnel et Personnel": 2,
                              "Communication interculturelle": 1,
                              Français: 2,
                              Anglais: 2,
                            }
                          : {
                              "Mathématiques 4": 5,
                              "Mathématiques 5": 6,
                              Statistiques: 4,
                              "Programmation Orientée Objet": 5,
                              "Bases de données": 4,
                              "Web 2": 3,
                              "Mécanique 2": 3,
                              "Electronique Numérique 2": 4,
                              "Systèmes embarqués": 5,
                              "Projet Innovation": 6,
                              "Projet Entreprise": 8,
                              Stage: 12,
                              "Management de projet": 3,
                              "Éthique et technologie": 2,
                              "Communication professionnelle": 3,
                              "Anglais professionnel": 4,
                            }

                      const defaultEvaluationWeights =
                        value === "ADI1"
                          ? {
                              "Mathématiques 1": { written: 33, continuous: 33, project: 34 },
                              "Mathématiques 2": { written: 45, continuous: 15, project: 40 },
                              "Mathématiques 3": { written: 45, continuous: 15, project: 40 },
                              "C Microcontrôleur et algorithmie 1": { written: 67, continuous: 33, project: 0 },
                              Bureautique: { written: 0, continuous: 100, project: 0 },
                              "Web 1": { written: 67, continuous: 33, project: 0 },
                              "Mécanique 1": { written: 75, continuous: 0, project: 25 },
                              "Electronique Numérique 1": { written: 25, continuous: 50, project: 25 },
                              "Machines-Outils": { written: 0, continuous: 100, project: 0 },
                              "Projets Alpha": { written: 0, continuous: 0, project: 100 },
                              "Projets Beta": { written: 0, continuous: 0, project: 100 },
                              "Projet Gamma": { written: 0, continuous: 0, project: 100 },
                              "Gestion de projet": { written: 67, continuous: 33, project: 0 },
                              "Introduction à la pensée critique": { written: 0, continuous: 100, project: 0 },
                              "Projet Professionnel et Personnel": { written: 0, continuous: 100, project: 0 },
                              "Communication interculturelle": { written: 0, continuous: 100, project: 0 },
                              Français: { written: 0, continuous: 100, project: 0 },
                              Anglais: { written: 0, continuous: 100, project: 0 },
                            }
                          : {
                              "Mathématiques 4": { written: 50, continuous: 20, project: 30 },
                              "Mathématiques 5": { written: 60, continuous: 10, project: 30 },
                              Statistiques: { written: 40, continuous: 30, project: 30 },
                              "Programmation Orientée Objet": { written: 30, continuous: 20, project: 50 },
                              "Bases de données": { written: 40, continuous: 20, project: 40 },
                              "Web 2": { written: 20, continuous: 30, project: 50 },
                              "Mécanique 2": { written: 60, continuous: 20, project: 20 },
                              "Electronique Numérique 2": { written: 30, continuous: 30, project: 40 },
                              "Systèmes embarqués": { written: 30, continuous: 20, project: 50 },
                              "Projet Innovation": { written: 0, continuous: 20, project: 80 },
                              "Projet Entreprise": { written: 0, continuous: 10, project: 90 },
                              Stage: { written: 0, continuous: 0, project: 100 },
                              "Management de projet": { written: 40, continuous: 30, project: 30 },
                              "Éthique et technologie": { written: 30, continuous: 70, project: 0 },
                              "Communication professionnelle": { written: 20, continuous: 80, project: 0 },
                              "Anglais professionnel": { written: 40, continuous: 60, project: 0 },
                            }

                      setLocalSettings({
                        ...localSettings,
                        year: value,
                        courseToUnitMapping: defaultCourseToUnitMapping,
                        unitCreditsMapping: defaultUnitCreditsMapping,
                        courseCoefficientsMapping: defaultCourseCoefficientsMapping,
                        evaluationWeights: defaultEvaluationWeights,
                      })
                    }}
                  >
                    <SelectTrigger id="year" className="text-base">
                      <SelectValue placeholder="Sélectionner votre année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADI1" className="text-base">
                        ADI1 (1ère année)
                      </SelectItem>
                      <SelectItem value="ADI2" className="text-base">
                        ADI2 (2ème année)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="passing-grade">Note de validation (sur 20)</Label>
                  <Input
                    id="passing-grade"
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={localSettings.passingGrade}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        passingGrade: Number.parseFloat(e.target.value) || 10,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Note minimale pour valider une UE (par défaut: 10)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-compensation"
                    checked={localSettings.useCompensation}
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        useCompensation: checked,
                      })
                    }
                  />
                  <Label htmlFor="use-compensation">Utiliser la compensation entre UE</Label>
                </div>

                {localSettings.useCompensation && (
                  <div>
                    <Label htmlFor="compensation-threshold">Seuil de compensation (sur 20)</Label>
                    <Input
                      id="compensation-threshold"
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={localSettings.compensationThreshold}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          compensationThreshold: Number.parseFloat(e.target.value) || 8,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Note minimale pour qu'une UE puisse être compensée (par défaut: 8)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
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

