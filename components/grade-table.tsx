"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StudentData, GradeEntry } from "@/types/grades"
import { Badge } from "@/components/ui/badge"

interface GradeTableProps {
  studentData: StudentData
  onUpdate: (updatedData: StudentData) => void
  isSaving: boolean
}

export function GradeTable({ studentData, onUpdate, isSaving }: GradeTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GradeEntry | null
    direction: "ascending" | "descending"
  }>({
    key: null,
    direction: "ascending",
  })

  const [editingGrade, setEditingGrade] = useState<GradeEntry | null>(null)
  const [newGrade, setNewGrade] = useState<Partial<GradeEntry>>({
    date: new Date().toISOString().split("T")[0],
    name: "",
    subject: "",
    grade: 0,
    coefficient: 1,
    isWrittenExam: false,
    isContinuousAssessment: true,
    isProject: false,
  })

  const [editMode, setEditMode] = useState<"edit" | "add">("edit")

  const handleSort = (key: keyof GradeEntry) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const filteredGrades = studentData.grades.filter(
    (grade) =>
      grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedGrades = [...filteredGrades].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "ascending" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const handleEditGrade = (grade: GradeEntry) => {
    setEditingGrade(grade)
    setEditMode("edit")
  }

  const handleAddGrade = () => {
    setEditMode("add")
    setNewGrade({
      date: new Date().toISOString().split("T")[0],
      name: "",
      subject: "",
      grade: 0,
      coefficient: 1,
      isWrittenExam: false,
      isContinuousAssessment: true,
      isProject: false,
    })
  }

  const handleDeleteGrade = (gradeToDelete: GradeEntry) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      const updatedGrades = studentData.grades.filter((grade) => grade !== gradeToDelete)

      const updatedData = {
        ...studentData,
        grades: updatedGrades,
      }

      onUpdate(updatedData)
    }
  }

  const handleSaveEdit = () => {
    if (!editingGrade) return

    const updatedGrades = studentData.grades.map((grade) => (grade === editingGrade ? editingGrade : grade))

    const updatedData = {
      ...studentData,
      grades: updatedGrades,
    }

    onUpdate(updatedData)
    setEditingGrade(null)
  }

  const handleSaveNew = () => {
    // Generate a unique code for the new grade
    const code = `MANUAL_${Date.now()}`

    const newGradeEntry: GradeEntry = {
      ...(newGrade as GradeEntry),
      code: code,
      date: newGrade.date || new Date().toISOString().split("T")[0],
    }

    const updatedGrades = [...studentData.grades, newGradeEntry]

    const updatedData = {
      ...studentData,
      grades: updatedGrades,
    }

    onUpdate(updatedData)
  }

  const handleEditChange = (field: keyof GradeEntry, value: any) => {
    if (!editingGrade) return

    if (field === "grade" || field === "coefficient") {
      value = Number.parseFloat(value)
      if (isNaN(value)) value = 0
    }

    setEditingGrade({
      ...editingGrade,
      [field]: value,
    })
  }

  const handleNewGradeChange = (field: keyof GradeEntry, value: any) => {
    if (field === "grade" || field === "coefficient") {
      value = Number.parseFloat(value)
      if (isNaN(value)) value = 0
    }

    setNewGrade({
      ...newGrade,
      [field]: value,
    })
  }

  const handleTypeChange = (value: string) => {
    if (!editingGrade) return

    setEditingGrade({
      ...editingGrade,
      isWrittenExam: value === "written",
      isContinuousAssessment: value === "continuous",
      isProject: value === "project",
    })
  }

  const handleNewTypeChange = (value: string) => {
    setNewGrade({
      ...newGrade,
      isWrittenExam: value === "written",
      isContinuousAssessment: value === "continuous",
      isProject: value === "project",
    })
  }

  const getGradeType = (grade: GradeEntry): string => {
    if (grade.isWrittenExam) return "written"
    if (grade.isContinuousAssessment) return "continuous"
    if (grade.isProject) return "project"
    return "continuous"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom ou matière..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{filteredGrades.length} notes trouvées</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleAddGrade}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle note</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-date">Date</Label>
                    <Input
                      id="new-date"
                      type="date"
                      value={newGrade.date}
                      onChange={(e) => handleNewGradeChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-subject">Matière</Label>
                    <Input
                      id="new-subject"
                      value={newGrade.subject}
                      onChange={(e) => handleNewGradeChange("subject", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-name">Nom de l'épreuve</Label>
                  <Input
                    id="new-name"
                    value={newGrade.name}
                    onChange={(e) => handleNewGradeChange("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-grade">Note</Label>
                    <Input
                      id="new-grade"
                      type="number"
                      min="0"
                      max="20"
                      step="0.01"
                      value={newGrade.grade?.toString()}
                      onChange={(e) => handleNewGradeChange("grade", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-coefficient">Coefficient</Label>
                    <Input
                      id="new-coefficient"
                      type="number"
                      min="1"
                      step="1"
                      value={newGrade.coefficient?.toString()}
                      onChange={(e) => handleNewGradeChange("coefficient", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-type">Type d'évaluation</Label>
                  <Select onValueChange={handleNewTypeChange} defaultValue="continuous">
                    <SelectTrigger id="new-type">
                      <SelectValue placeholder="Type d'évaluation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="written">Épreuve écrite</SelectItem>
                      <SelectItem value="continuous">Contrôle continu</SelectItem>
                      <SelectItem value="project">Projet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleSaveNew} disabled={!newGrade.name || !newGrade.subject}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Ajouter"
                    )}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("date")}>
                  Date
                  {sortConfig.key === "date" && <span>{sortConfig.direction === "ascending" ? " ↑" : " ↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("name")}>
                  Épreuve
                  {sortConfig.key === "name" && <span>{sortConfig.direction === "ascending" ? " ↑" : " ↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-50" onClick={() => handleSort("subject")}>
                  Matière
                  {sortConfig.key === "subject" && <span>{sortConfig.direction === "ascending" ? " ↑" : " ↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-slate-50 text-right" onClick={() => handleSort("grade")}>
                  Note
                  {sortConfig.key === "grade" && <span>{sortConfig.direction === "ascending" ? " ↑" : " ↓"}</span>}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort("coefficient")}
                >
                  Coefficient
                  {sortConfig.key === "coefficient" && (
                    <span>{sortConfig.direction === "ascending" ? " ↑" : " ↓"}</span>
                  )}
                </TableHead>
                <TableHead className="text-right">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGrades.length > 0 ? (
                sortedGrades.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{grade.date}</TableCell>
                    <TableCell>{grade.name}</TableCell>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell className="text-right font-medium">{grade.grade.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{grade.coefficient}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={`${
                          grade.isWrittenExam
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : grade.isContinuousAssessment
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }`}
                        variant="outline"
                      >
                        {grade.isWrittenExam ? "Écrit" : grade.isContinuousAssessment ? "Contrôle continu" : "Projet"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditGrade(grade)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier la note</DialogTitle>
                            </DialogHeader>
                            {editingGrade && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input
                                      id="edit-date"
                                      type="date"
                                      value={editingGrade.date}
                                      onChange={(e) => handleEditChange("date", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-subject">Matière</Label>
                                    <Input
                                      id="edit-subject"
                                      value={editingGrade.subject}
                                      onChange={(e) => handleEditChange("subject", e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Nom de l'épreuve</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingGrade.name}
                                    onChange={(e) => handleEditChange("name", e.target.value)}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-grade">Note</Label>
                                    <Input
                                      id="edit-grade"
                                      type="number"
                                      min="0"
                                      max="20"
                                      step="0.01"
                                      value={editingGrade.grade.toString()}
                                      onChange={(e) => handleEditChange("grade", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-coefficient">Coefficient</Label>
                                    <Input
                                      id="edit-coefficient"
                                      type="number"
                                      min="1"
                                      step="1"
                                      value={editingGrade.coefficient.toString()}
                                      onChange={(e) => handleEditChange("coefficient", e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-type">Type d'évaluation</Label>
                                  <Select onValueChange={handleTypeChange} defaultValue={getGradeType(editingGrade)}>
                                    <SelectTrigger id="edit-type">
                                      <SelectValue placeholder="Type d'évaluation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="written">Épreuve écrite</SelectItem>
                                      <SelectItem value="continuous">Contrôle continu</SelectItem>
                                      <SelectItem value="project">Projet</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Annuler</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleSaveEdit}>
                                  {isSaving ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Enregistrement...
                                    </>
                                  ) : (
                                    "Enregistrer"
                                  )}
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteGrade(grade)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-slate-500">
                    Aucune note trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

