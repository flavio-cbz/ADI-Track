"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Edit2, X, Target } from "lucide-react"
import type { StudentData } from "@/types/grades"

interface GoalsTrackerProps {
  studentData: StudentData
  onUpdate: (updatedData: StudentData) => void
}

interface Goal {
  id: string
  type: "general" | "course" | "unit"
  target: string // Subject or unit name
  targetValue: number
  currentValue: number
  achieved: boolean
}

export function GoalsTracker({ studentData, onUpdate }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: "general",
    target: "",
    targetValue: 12,
  })

  useEffect(() => {
    // Load goals from studentData if available
    if (studentData.goals) {
      setGoals(studentData.goals)
    } else {
      // Initialize with default goal if no goals exist
      setGoals([
        {
          id: "default",
          type: "general",
          target: "Moyenne générale",
          targetValue: 12,
          currentValue: studentData.generalAverage,
          achieved: studentData.generalAverage >= 12,
        },
      ])
    }

    // Update current values for each goal
    updateGoalsProgress(studentData)
  }, [studentData])

  const updateGoalsProgress = (data: StudentData) => {
    setGoals((prevGoals) => {
      return prevGoals.map((goal) => {
        let currentValue = 0
        let achieved = false

        if (goal.type === "general") {
          currentValue = data.generalAverage
          achieved = currentValue >= goal.targetValue
        } else if (goal.type === "course") {
          const course = data.courseAverages.find((c) => c.courseName === goal.target)
          if (course) {
            currentValue = course.average
            achieved = currentValue >= goal.targetValue
          }
        } else if (goal.type === "unit") {
          const unit = data.unitAverages.find((u) => u.unitName === goal.target)
          if (unit) {
            currentValue = unit.average
            achieved = currentValue >= goal.targetValue
          }
        }

        return {
          ...goal,
          currentValue,
          achieved,
        }
      })
    })
  }

  const handleAddGoal = () => {
    if (!newGoal.type || !newGoal.target || !newGoal.targetValue) {
      return
    }

    // Find current value based on goal type and target
    let currentValue = 0

    if (newGoal.type === "general") {
      currentValue = studentData.generalAverage
    } else if (newGoal.type === "course") {
      const course = studentData.courseAverages.find((c) => c.courseName === newGoal.target)
      if (course) {
        currentValue = course.average
      }
    } else if (newGoal.type === "unit") {
      const unit = studentData.unitAverages.find((u) => u.unitName === newGoal.target)
      if (unit) {
        currentValue = unit.average
      }
    }

    const goal: Goal = {
      id: Date.now().toString(),
      type: newGoal.type as "general" | "course" | "unit",
      target: newGoal.target || "",
      targetValue: newGoal.targetValue || 12,
      currentValue,
      achieved: currentValue >= (newGoal.targetValue || 12),
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)

    // Save goals in student data
    const updatedData = {
      ...studentData,
      goals: updatedGoals,
    }
    onUpdate(updatedData)

    // Reset and close form
    setNewGoal({
      type: "general",
      target: "",
      targetValue: 12,
    })
    setIsAddingGoal(false)
  }

  const handleUpdateGoal = () => {
    if (!editingGoal) return

    const updatedGoals = goals.map((goal) => (goal.id === editingGoal.id ? editingGoal : goal))

    setGoals(updatedGoals)

    // Save goals in student data
    const updatedData = {
      ...studentData,
      goals: updatedGoals,
    }
    onUpdate(updatedData)

    setEditingGoal(null)
  }

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    setGoals(updatedGoals)

    // Save goals in student data
    const updatedData = {
      ...studentData,
      goals: updatedGoals,
    }
    onUpdate(updatedData)
  }

  const getProgressColor = (goal: Goal) => {
    const progress = (goal.currentValue / goal.targetValue) * 100
    if (goal.achieved) return "bg-green-600"
    if (progress >= 90) return "bg-emerald-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  const getProgressPercentage = (goal: Goal) => {
    const progress = (goal.currentValue / goal.targetValue) * 100
    return Math.min(100, Math.max(0, progress))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs personnalisés
            </CardTitle>
            <CardDescription>Définissez et suivez vos objectifs de notes</CardDescription>
          </div>
          {!isAddingGoal && !editingGoal && (
            <Button onClick={() => setIsAddingGoal(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un objectif
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAddingGoal ? (
          <div className="space-y-4 border p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Nouvel objectif</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAddingGoal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Type d'objectif</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, type: value as "general" | "course" | "unit", target: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Moyenne générale</SelectItem>
                    <SelectItem value="course">Matière spécifique</SelectItem>
                    <SelectItem value="unit">Unité d'enseignement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newGoal.type === "general" ? (
                <input type="hidden" value="Moyenne générale" />
              ) : (
                <div className="space-y-1">
                  <Label>Cible</Label>
                  <Select value={newGoal.target} onValueChange={(value) => setNewGoal({ ...newGoal, target: value })}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Sélectionner ${newGoal.type === "course" ? "une matière" : "une UE"}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {newGoal.type === "course"
                        ? studentData.courseAverages.map((course) => (
                            <SelectItem key={course.courseName} value={course.courseName}>
                              {course.courseName}
                            </SelectItem>
                          ))
                        : studentData.unitAverages.map((unit) => (
                            <SelectItem key={unit.unitName} value={unit.unitName}>
                              {unit.unitName}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <Label>Note cible</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={newGoal.targetValue?.toString() || "12"}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddGoal}>Ajouter</Button>
              </div>
            </div>
          </div>
        ) : editingGoal ? (
          <div className="space-y-4 border p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Modifier l'objectif</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingGoal(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Type d'objectif</Label>
                <Input
                  value={
                    editingGoal.type === "general"
                      ? "Moyenne générale"
                      : editingGoal.type === "course"
                        ? "Matière spécifique"
                        : "Unité d'enseignement"
                  }
                  disabled
                />
              </div>

              <div className="space-y-1">
                <Label>Cible</Label>
                <Input value={editingGoal.target} disabled />
              </div>

              <div className="space-y-1">
                <Label>Note cible</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={editingGoal.targetValue.toString()}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetValue: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingGoal(null)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateGoal}>Enregistrer</Button>
              </div>
            </div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Vous n'avez défini aucun objectif pour le moment.</p>
            <Button onClick={() => setIsAddingGoal(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un premier objectif
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{goal.target}</h3>
                    <Badge variant={goal.achieved ? "default" : "outline"}>
                      {goal.achieved ? "Objectif atteint" : "En cours"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingGoal(goal)} title="Modifier">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)} title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{goal.currentValue.toFixed(2)}/20</span>
                      <span>Objectif: {goal.targetValue.toFixed(2)}/20</span>
                    </div>
                    <Progress
                      value={getProgressPercentage(goal)}
                      className="h-2"
                      indicatorClassName={getProgressColor(goal)}
                    />
                  </div>
                  <div className="w-20 text-right">
                    <span className={`text-lg font-bold ${goal.achieved ? "text-green-600" : "text-primary"}`}>
                      {Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Les objectifs sont automatiquement mis à jour lorsque vos notes changent.
      </CardFooter>
    </Card>
  )
}

