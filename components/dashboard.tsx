"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { StudentData } from "@/types/grades"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Calendar, GraduationCap, Award } from "lucide-react"

interface DashboardProps {
  studentData: StudentData
  classData: StudentData[]
}

export function Dashboard({ studentData, classData }: DashboardProps) {
  const [gradeHistory, setGradeHistory] = useState<any[]>([])

  useEffect(() => {
    // Generate grade history data by sorting grades by date
    if (studentData) {
      const sortedGrades = [...studentData.grades].sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"))
        const dateB = new Date(b.date.split("/").reverse().join("-"))
        return dateA.getTime() - dateB.getTime()
      })

      // Create cumulative average data points
      const history = sortedGrades.map((grade, index) => {
        const gradesUpToNow = sortedGrades.slice(0, index + 1)
        const sum = gradesUpToNow.reduce((acc, g) => acc + g.grade * g.coefficient, 0)
        const totalCoef = gradesUpToNow.reduce((acc, g) => acc + g.coefficient, 0)
        const average = totalCoef > 0 ? sum / totalCoef : 0

        return {
          date: grade.date,
          name: grade.name.length > 20 ? grade.name.substring(0, 20) + "..." : grade.name,
          grade: grade.grade,
          average: Number.parseFloat(average.toFixed(2)),
        }
      })

      setGradeHistory(history)
    }
  }, [studentData])

  // Calculate if student is passing the year
  const isPassing = studentData.generalAverage >= 10 && studentData.validatedCredits >= studentData.totalCredits * 0.8

  // Calculate remaining credits needed
  const remainingCredits = studentData.totalCredits - studentData.validatedCredits

  // Calculate units at risk (average between 8 and 10)
  const unitsAtRisk = studentData.unitAverages.filter((unit) => unit.average >= 8 && unit.average < 10)

  // Calculate failed units (average < 8)
  const failedUnits = studentData.unitAverages.filter((unit) => unit.average < 8)

  // Calculate next exams (mock data - in a real app this would come from a calendar)
  const nextExams = [
    { date: "15/06/2025", subject: "Mathématiques 3", type: "DS Final" },
    { date: "18/06/2025", subject: "Electronique Numérique 1", type: "Projet" },
    { date: "22/06/2025", subject: "Anglais", type: "TOEIC" },
  ]

  // Calculate grade trend (improving or declining)
  const gradeTrend =
    gradeHistory.length >= 5
      ? gradeHistory.slice(-5).reduce((acc, curr, idx, arr) => {
          if (idx === 0) return acc
          return acc + (curr.average - arr[idx - 1].average)
        }, 0) / 4
      : 0

  const getGradeColor = (grade: number) => {
    if (grade >= 14) return "text-green-600"
    if (grade >= 10) return "text-blue-600"
    if (grade >= 8) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Passing status banner */}
      <Alert className={isPassing ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
        {isPassing ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-amber-600" />
        )}
        <AlertTitle className={isPassing ? "text-green-800" : "text-amber-800"}>
          {isPassing
            ? "Vous êtes en bonne voie pour valider votre année !"
            : "Attention, vous risquez de ne pas valider votre année"}
        </AlertTitle>
        <AlertDescription className={isPassing ? "text-green-700" : "text-amber-700"}>
          {isPassing
            ? `Votre moyenne générale est de ${studentData.generalAverage.toFixed(2)}/20 et vous avez validé ${studentData.validatedCredits}/${studentData.totalCredits} crédits.`
            : `Votre moyenne générale est de ${studentData.generalAverage.toFixed(2)}/20 et il vous manque ${remainingCredits} crédits pour valider votre année.`}
        </AlertDescription>
      </Alert>

      {/* Key metrics */}
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
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">Progression</div>
              <div className="flex items-center">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      studentData.generalAverage >= 10
                        ? "bg-green-600"
                        : studentData.generalAverage >= 8
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${(studentData.generalAverage / 20) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-slate-500">
                  {((studentData.generalAverage / 20) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
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
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">Progression</div>
              <div className="flex items-center">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tendance</CardTitle>
            <CardDescription>Évolution récente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {gradeTrend > 0.1 ? (
                <>
                  <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
                  <div>
                    <div className="text-xl font-bold text-green-600">En hausse</div>
                    <div className="text-sm text-slate-500">
                      +{gradeTrend.toFixed(2)} points sur les 5 dernières notes
                    </div>
                  </div>
                </>
              ) : gradeTrend < -0.1 ? (
                <>
                  <TrendingDown className="h-8 w-8 text-red-600 mr-2" />
                  <div>
                    <div className="text-xl font-bold text-red-600">En baisse</div>
                    <div className="text-sm text-slate-500">
                      {gradeTrend.toFixed(2)} points sur les 5 dernières notes
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-8 w-8 flex items-center justify-center text-amber-600 mr-2">—</div>
                  <div>
                    <div className="text-xl font-bold text-amber-600">Stable</div>
                    <div className="text-sm text-slate-500">Peu de variation récente</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unités d'enseignement - Section mise en évidence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Unités d'enseignement
          </CardTitle>
          <CardDescription>Vue d'ensemble de vos UE et de leur statut</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentData.unitAverages.map((unit, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  unit.average >= 14
                    ? "border-l-green-500 bg-green-50"
                    : unit.average >= 10
                      ? "border-l-blue-500 bg-blue-50"
                      : unit.average >= 8
                        ? "border-l-amber-500 bg-amber-50"
                        : "border-l-red-500 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{unit.unitName}</h3>
                  <Badge
                    variant="outline"
                    className={`${
                      unit.average >= 10
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {unit.average >= 10 ? "Validé" : "Non validé"}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-2xl font-bold ${getGradeColor(unit.average)}`}>{unit.average.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">/20</span>
                  <span className="text-sm ml-auto">{unit.credits} ECTS</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade progression chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des notes</CardTitle>
          <CardDescription>Progression de votre moyenne au fil du temps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 20]} />
                <Tooltip formatter={(value) => [`${value}/20`, "Note"]} labelFormatter={(label) => `Date: ${label}`} />
                <Line
                  type="monotone"
                  dataKey="grade"
                  stroke="#f87171"
                  name="Note"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line type="monotone" dataKey="average" stroke="#60a5fa" name="Moyenne cumulée" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Units status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Unités d'enseignement à risque</CardTitle>
            <CardDescription>Unités avec une moyenne entre 8 et 10</CardDescription>
          </CardHeader>
          <CardContent>
            {unitsAtRisk.length > 0 ? (
              <ul className="space-y-2">
                {unitsAtRisk.map((unit, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-amber-50 rounded-md">
                    <div>
                      <span className="font-medium">{unit.unitName}</span>
                      <span className="text-sm text-slate-500 ml-2">({unit.credits} ECTS)</span>
                    </div>
                    <span className={`font-medium ${getGradeColor(unit.average)}`}>{unit.average.toFixed(2)}/20</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p>Aucune unité à risque</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unités non validées</CardTitle>
            <CardDescription>Unités avec une moyenne inférieure à 8</CardDescription>
          </CardHeader>
          <CardContent>
            {failedUnits.length > 0 ? (
              <ul className="space-y-2">
                {failedUnits.map((unit, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                    <div>
                      <span className="font-medium">{unit.unitName}</span>
                      <span className="text-sm text-slate-500 ml-2">({unit.credits} ECTS)</span>
                    </div>
                    <span className={`font-medium ${getGradeColor(unit.average)}`}>{unit.average.toFixed(2)}/20</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-slate-500">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <p>Aucune unité non validée</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming exams */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines évaluations</CardTitle>
          <CardDescription>Calendrier des prochaines épreuves</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {nextExams.map((exam, index) => (
              <li key={index} className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                  <div>
                    <div className="font-medium">{exam.subject}</div>
                    <div className="text-sm text-slate-500">{exam.type}</div>
                  </div>
                </div>
                <Badge variant="outline">{exam.date}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
          <CardDescription>Conseils personnalisés pour améliorer vos résultats</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {studentData.generalAverage < 10 && (
              <li className="flex items-start p-3 bg-blue-50 rounded-md">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">Augmentez votre moyenne générale</div>
                  <div className="text-sm text-blue-700">
                    Concentrez-vous sur les matières à fort coefficient pour maximiser l'impact sur votre moyenne
                    générale.
                  </div>
                </div>
              </li>
            )}

            {unitsAtRisk.length > 0 && (
              <li className="flex items-start p-3 bg-amber-50 rounded-md">
                <Award className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800">Unités à risque</div>
                  <div className="text-sm text-amber-700">
                    Concentrez vos efforts sur {unitsAtRisk.map((u) => u.unitName).join(", ")} pour atteindre la moyenne
                    et valider ces unités.
                  </div>
                </div>
              </li>
            )}

            {failedUnits.length > 0 && (
              <li className="flex items-start p-3 bg-red-50 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">Unités en difficulté</div>
                  <div className="text-sm text-red-700">
                    Demandez de l'aide supplémentaire pour {failedUnits.map((u) => u.unitName).join(", ")}. Envisagez
                    des séances de tutorat.
                  </div>
                </div>
              </li>
            )}

            {studentData.generalAverage >= 10 && unitsAtRisk.length === 0 && failedUnits.length === 0 && (
              <li className="flex items-start p-3 bg-green-50 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Continuez sur cette lancée</div>
                  <div className="text-sm text-green-700">
                    Vous êtes sur la bonne voie ! Maintenez votre rythme de travail pour conserver vos bons résultats.
                  </div>
                </div>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

