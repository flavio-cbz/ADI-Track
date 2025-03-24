"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StudentData } from "@/types/grades"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GradeSummaryProps {
  studentData: StudentData
  classData: StudentData[]
}

export function GradeSummary({ studentData, classData }: GradeSummaryProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getGradeColor = (grade: number) => {
    if (grade >= 14) return "text-green-600"
    if (grade >= 10) return "text-blue-600"
    if (grade >= 8) return "text-amber-600"
    return "text-red-600"
  }

  const getGradeBadge = (grade: number) => {
    if (grade >= 14)
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200" variant="outline">
          Très bien
        </Badge>
      )
    if (grade >= 12)
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" variant="outline">
          Bien
        </Badge>
      )
    if (grade >= 10)
      return (
        <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100 border-sky-200" variant="outline">
          Passable
        </Badge>
      )
    if (grade >= 8)
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300" variant="outline">
          Insuffisant
        </Badge>
      )
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200" variant="outline">
        Très insuffisant
      </Badge>
    )
  }

  const courseChartData = studentData.courseAverages.map((course) => ({
    name: course.courseName.length > 15 ? course.courseName.substring(0, 15) + "..." : course.courseName,
    average: course.average,
    fill: course.average >= 10 ? "#4ade80" : "#f87171",
  }))

  const unitChartData = studentData.unitAverages.map((unit) => {
    return {
      name: unit.unitName.length > 15 ? unit.unitName.substring(0, 15) + "..." : unit.unitName,
      "Votre moyenne": unit.average,
      credits: unit.credits,
    }
  })

  // Identify strengths and weaknesses
  const strengths = studentData.courseAverages
    .filter((course) => course.average >= 14)
    .sort((a, b) => b.average - a.average)
    .slice(0, 3)

  const weaknesses = studentData.courseAverages
    .filter((course) => course.average < 10)
    .sort((a, b) => a.average - b.average)
    .slice(0, 3)

  // Calculate improvement opportunities
  const improvementOpportunities = studentData.unitAverages
    .filter((unit) => unit.average < 10 && unit.average >= 8)
    .map((unit) => {
      const coursesInUnit = studentData.courseAverages
        .filter((course) => course.unitName === unit.unitName)
        .sort((a, b) => a.average - b.average)

      return {
        unitName: unit.unitName,
        unitAverage: unit.average,
        weakestCourses: coursesInUnit.slice(0, 2),
      }
    })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Moyenne générale</CardTitle>
            <CardDescription>Semestre 1</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className={`text-4xl font-bold ${getGradeColor(studentData.generalAverage)}`}>
                {studentData.generalAverage.toFixed(2)}
              </div>
              <div className="text-sm text-slate-500 mb-1">/20</div>
            </div>
            <div className="mt-2">{getGradeBadge(studentData.generalAverage)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Crédits ECTS</CardTitle>
            <CardDescription>Validés / Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {studentData.validatedCredits} / {studentData.totalCredits}
            </div>
            <div className="flex items-center mt-2">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(studentData.validatedCredits / studentData.totalCredits) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-slate-500">
                {((studentData.validatedCredits / studentData.totalCredits) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statut</CardTitle>
            <CardDescription>Validation de l'année</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-700">
              {studentData.generalAverage >= 10 && studentData.validatedCredits >= studentData.totalCredits * 0.8
                ? "Validé"
                : "Non validé"}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {studentData.generalAverage >= 10 && studentData.validatedCredits >= studentData.totalCredits * 0.8
                ? "Vous avez validé les conditions requises"
                : "Il vous manque des crédits ou une moyenne suffisante"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="courses">Détail par cours</TabsTrigger>
          <TabsTrigger value="units">Unités d'enseignement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Points forts</CardTitle>
                <CardDescription>Vos meilleures matières</CardDescription>
              </CardHeader>
              <CardContent>
                {strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {strengths.map((course, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                        <span>{course.courseName}</span>
                        <span className={`font-medium ${getGradeColor(course.average)}`}>
                          {course.average.toFixed(2)}/20
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic">Aucune matière avec une note supérieure à 14/20</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Points à améliorer</CardTitle>
                <CardDescription>Matières nécessitant plus d'attention</CardDescription>
              </CardHeader>
              <CardContent>
                {weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                    {weaknesses.map((course, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                        <span>{course.courseName}</span>
                        <span className={`font-medium ${getGradeColor(course.average)}`}>
                          {course.average.toFixed(2)}/20
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic">Toutes vos matières ont une note supérieure à 10/20</p>
                )}
              </CardContent>
            </Card>
          </div>

          {improvementOpportunities.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Opportunités d'amélioration</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Vous êtes proche de valider ces unités d'enseignement :</p>
                <ul className="space-y-2 mt-2">
                  {improvementOpportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm">
                      <strong>{opportunity.unitName}</strong> ({opportunity.unitAverage.toFixed(2)}/20) -
                      Concentrez-vous sur : {opportunity.weakestCourses.map((c) => c.courseName).join(", ")}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Répartition des moyennes</CardTitle>
              <CardDescription>Vos moyennes par UE</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={unitChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    barGap={0}
                    barCategoryGap={15}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Votre moyenne" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Moyennes par cours</CardTitle>
              <CardDescription>Détail des moyennes calculées pour chaque cours selon les coefficients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseChartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 20]} />
                    <Tooltip
                      formatter={(value) => [`${Number(value).toFixed(2)}/20`, "Moyenne"]}
                      labelFormatter={(label) => `Cours: ${label}`}
                    />
                    <Bar dataKey="average" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cours</TableHead>
                      <TableHead>Coefficient</TableHead>
                      <TableHead className="text-right">Moyenne</TableHead>
                      <TableHead className="text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.courseAverages.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{course.courseName}</TableCell>
                        <TableCell>{course.coefficient}</TableCell>
                        <TableCell className={`text-right font-medium ${getGradeColor(course.average)}`}>
                          {course.average.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{getGradeBadge(course.average)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {studentData.unitAverages.map((unit, index) => (
              <Card
                key={index}
                className={`overflow-hidden border-l-4 ${
                  unit.average >= 14
                    ? "border-l-green-500"
                    : unit.average >= 10
                      ? "border-l-blue-500"
                      : unit.average >= 8
                        ? "border-l-amber-500"
                        : "border-l-red-500"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{unit.unitName}</span>
                    <Badge variant="outline" className="ml-2">
                      {unit.credits} ECTS
                    </Badge>
                  </CardTitle>
                  <CardDescription>{unit.validated ? "Unité validée" : "Unité non validée"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className={`text-3xl font-bold ${getGradeColor(unit.average)}`}>{unit.average.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">/20</div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                      <div
                        className={`h-2.5 rounded-full ${
                          unit.average >= 14
                            ? "bg-green-500"
                            : unit.average >= 10
                              ? "bg-blue-500"
                              : unit.average >= 8
                                ? "bg-amber-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${(unit.average / 20) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>0</span>
                      <span className="font-medium">Seuil: 10</span>
                      <span>20</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Moyennes par unité d'enseignement</CardTitle>
              <CardDescription>Détail des moyennes calculées pour chaque UE selon les coefficients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={unitChartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 20]} />
                    <Tooltip
                      formatter={(value) => [`${Number(value).toFixed(2)}/20`, "Moyenne"]}
                      labelFormatter={(label) => `UE: ${label}`}
                    />
                    <Bar dataKey="Votre moyenne" fill="#60a5fa">
                      {unitChartData.map((entry, index) => {
                        const average = studentData.unitAverages[index].average
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              average >= 14
                                ? "#22c55e"
                                : average >= 10
                                  ? "#3b82f6"
                                  : average >= 8
                                    ? "#f59e0b"
                                    : "#ef4444"
                            }
                          />
                        )
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unité d'enseignement</TableHead>
                      <TableHead>Crédits ECTS</TableHead>
                      <TableHead className="text-right">Moyenne</TableHead>
                      <TableHead className="text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.unitAverages.map((unit, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{unit.unitName}</TableCell>
                        <TableCell>{unit.credits}</TableCell>
                        <TableCell className={`text-right font-medium ${getGradeColor(unit.average)}`}>
                          {unit.average.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={`${
                              unit.average >= 10
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                            }`}
                            variant="outline"
                          >
                            {unit.average >= 10 ? "Validé" : "Non validé"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

