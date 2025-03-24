"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { StudentData, GradeEntry } from "@/types/grades"

interface StatsViewProps {
  studentData: StudentData
}

export function StatsView({ studentData }: StatsViewProps) {
  const [activeTab, setActiveTab] = useState("distribution")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [predictionData, setPredictionData] = useState<any>(null)

  useEffect(() => {
    if (studentData && studentData.courseAverages.length > 0) {
      if (!selectedSubject) {
        setSelectedSubject(studentData.courseAverages[0].courseName)
      }

      generatePredictions()
    }
  }, [studentData, selectedSubject])

  const generatePredictions = () => {
    // Calculer la tendance pour chaque matière
    const trendBySubject: Record<string, number> = {}

    // Regrouper les notes par matière et trier par date
    const gradesBySubject: Record<string, GradeEntry[]> = {}

    studentData.grades.forEach((grade) => {
      if (!gradesBySubject[grade.subject]) {
        gradesBySubject[grade.subject] = []
      }
      gradesBySubject[grade.subject].push(grade)
    })

    // Trier par date et calculer la tendance
    Object.keys(gradesBySubject).forEach((subject) => {
      const grades = gradesBySubject[subject].sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"))
        const dateB = new Date(b.date.split("/").reverse().join("-"))
        return dateA.getTime() - dateB.getTime()
      })

      if (grades.length >= 2) {
        // Calculer la tendance moyenne entre chaque note
        let totalTrend = 0
        for (let i = 1; i < grades.length; i++) {
          totalTrend += grades[i].grade - grades[i - 1].grade
        }
        trendBySubject[subject] = totalTrend / (grades.length - 1)
      } else {
        trendBySubject[subject] = 0
      }
    })

    // Prédire la prochaine note pour chaque matière
    const predictions = studentData.courseAverages.map((course) => {
      const currentAvg = course.average
      const trend = trendBySubject[course.courseName] || 0

      // Calculer une prédiction basée sur la tendance et la moyenne actuelle
      let predictedGrade = currentAvg + trend

      // Limiter entre 0 et 20
      predictedGrade = Math.max(0, Math.min(20, predictedGrade))

      return {
        courseName: course.courseName,
        currentAverage: currentAvg,
        predictedGrade: predictedGrade,
        trend,
      }
    })

    setPredictionData(predictions)
  }

  // Calculer la distribution des notes
  const getGradeDistribution = () => {
    const distribution = [
      { range: "0-5", count: 0, color: "#ef4444" },
      { range: "5-8", count: 0, color: "#f97316" },
      { range: "8-10", count: 0, color: "#eab308" },
      { range: "10-12", count: 0, color: "#84cc16" },
      { range: "12-14", count: 0, color: "#22c55e" },
      { range: "14-16", count: 0, color: "#14b8a6" },
      { range: "16-18", count: 0, color: "#0ea5e9" },
      { range: "18-20", count: 0, color: "#6366f1" },
    ]

    studentData.grades.forEach((grade) => {
      if (grade.grade < 5) distribution[0].count++
      else if (grade.grade < 8) distribution[1].count++
      else if (grade.grade < 10) distribution[2].count++
      else if (grade.grade < 12) distribution[3].count++
      else if (grade.grade < 14) distribution[4].count++
      else if (grade.grade < 16) distribution[5].count++
      else if (grade.grade < 18) distribution[6].count++
      else distribution[7].count++
    })

    return distribution
  }

  // Analyser par type d'évaluation
  const getEvaluationTypeAnalysis = () => {
    let writtenSum = 0,
      writtenCount = 0
    let continuousSum = 0,
      continuousCount = 0
    let projectSum = 0,
      projectCount = 0

    studentData.grades.forEach((grade) => {
      if (grade.isWrittenExam) {
        writtenSum += grade.grade
        writtenCount++
      } else if (grade.isContinuousAssessment) {
        continuousSum += grade.grade
        continuousCount++
      } else if (grade.isProject) {
        projectSum += grade.grade
        projectCount++
      }
    })

    return [
      {
        name: "Épreuves écrites",
        average: writtenCount > 0 ? writtenSum / writtenCount : 0,
        count: writtenCount,
        color: "#60a5fa",
      },
      {
        name: "Contrôle continu",
        average: continuousCount > 0 ? continuousSum / continuousCount : 0,
        count: continuousCount,
        color: "#4ade80",
      },
      {
        name: "Projets",
        average: projectCount > 0 ? projectSum / projectCount : 0,
        count: projectCount,
        color: "#f97316",
      },
    ]
  }

  // Analyser l'évolution des compétences (par UE)
  const getSkillsEvolution = () => {
    const skills = studentData.unitAverages.map((unit) => ({
      subject: unit.unitName,
      score: (unit.average / 20) * 100,
      fullMark: 100,
    }))

    return skills
  }

  // Calculer les variations entre évaluations
  const getGradeVariationBySubject = () => {
    const variationData: any[] = []

    // Regrouper par matière
    const gradesBySubject: Record<string, number[]> = {}

    studentData.grades.forEach((grade) => {
      if (!gradesBySubject[grade.subject]) {
        gradesBySubject[grade.subject] = []
      }
      gradesBySubject[grade.subject].push(grade.grade)
    })

    // Calculer les statistiques par matière
    Object.entries(gradesBySubject).forEach(([subject, grades]) => {
      if (grades.length > 1) {
        const avg = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        const min = Math.min(...grades)
        const max = Math.max(...grades)

        // Calculer l'écart-type
        const variance = grades.reduce((sum, grade) => sum + Math.pow(grade - avg, 2), 0) / grades.length
        const stdDev = Math.sqrt(variance)

        variationData.push({
          subject,
          average: avg,
          minimum: min,
          maximum: max,
          stdDev,
          range: max - min,
          count: grades.length,
        })
      }
    })

    return variationData.sort((a, b) => b.stdDev - a.stdDev)
  }

  // Calculer les forces et faiblesses relatives (comparaison des moyennes par type)
  const getRelativeStrengths = () => {
    const typeAnalysis = getEvaluationTypeAnalysis()
    const globalAverage = studentData.generalAverage

    return typeAnalysis.map((type) => ({
      ...type,
      difference: type.average - globalAverage,
      isStrength: type.average > globalAverage,
    }))
  }

  const gradeDistribution = getGradeDistribution()
  const evaluationTypeAnalysis = getEvaluationTypeAnalysis()
  const skillsEvolution = getSkillsEvolution()
  const variationData = getGradeVariationBySubject()
  const relativeStrengths = getRelativeStrengths()

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="distribution">Distribution des notes</TabsTrigger>
          <TabsTrigger value="evolution">Évolution et prédictions</TabsTrigger>
          <TabsTrigger value="typesAnalysis">Analyse par type</TabsTrigger>
          <TabsTrigger value="variation">Variation et stabilité</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des notes</CardTitle>
              <CardDescription>Répartition de vos notes par tranche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} notes`, "Nombre"]} />
                    <Bar dataKey="count" name="Nombre de notes">
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type d'évaluation</CardTitle>
                <CardDescription>Moyenne par type d'épreuve</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={evaluationTypeAnalysis}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.name}
                      >
                        {evaluationTypeAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const entry = props.payload
                          return [`${value} notes (${entry.average.toFixed(2)}/20)`, entry.name]
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forces et faiblesses</CardTitle>
                <CardDescription>Comparaison par type d'évaluation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relativeStrengths.map((strength, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{strength.name}</span>
                          <Badge variant={strength.isStrength ? "default" : "destructive"}>
                            {strength.isStrength ? "Point fort" : "Point faible"}
                          </Badge>
                        </div>
                        <span className={`font-medium ${strength.isStrength ? "text-green-600" : "text-red-600"}`}>
                          {strength.average.toFixed(2)}/20
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(strength.average / 20) * 100} className="h-2" />
                        <span className="text-xs text-muted-foreground w-32">
                          {strength.difference > 0 ? "+" : ""}
                          {strength.difference.toFixed(2)} vs moyenne générale
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Prédiction des notes futures</CardTitle>
              <CardDescription>Basée sur vos tendances actuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="w-64">
                    <Label htmlFor="subject-selector">Matière</Label>
                    <Select value={selectedSubject || undefined} onValueChange={setSelectedSubject}>
                      <SelectTrigger id="subject-selector">
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentData.courseAverages.map((course) => (
                          <SelectItem key={course.courseName} value={course.courseName}>
                            {course.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={predictionData?.filter((p) => !selectedSubject || p.courseName === selectedSubject)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="courseName" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 20]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="currentAverage" name="Moyenne actuelle" fill="#60a5fa" />
                      <Bar dataKey="predictedGrade" name="Prédiction" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {predictionData && selectedSubject && (
                  <div className="p-4 bg-muted/30 rounded-md">
                    <h4 className="font-medium mb-2">Analyse pour {selectedSubject}</h4>
                    <div>
                      {predictionData?.find((p) => p.courseName === selectedSubject)?.trend > 0 ? (
                        <p className="text-green-600">
                          Vos notes dans cette matière sont en hausse. Continuez vos efforts !
                        </p>
                      ) : predictionData?.find((p) => p.courseName === selectedSubject)?.trend < 0 ? (
                        <p className="text-red-600">
                          Attention, vos notes dans cette matière sont en baisse. Concentrez vos efforts.
                        </p>
                      ) : (
                        <p className="text-amber-600">Vos notes dans cette matière sont stables.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compétences par domaine</CardTitle>
              <CardDescription>Analyse radar de vos unités d'enseignement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsEvolution}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Niveau de compétence"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, "Niveau de maîtrise"]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typesAnalysis" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par type d'évaluation</CardTitle>
              <CardDescription>Comparaison des moyennes par type d'épreuve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={evaluationTypeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 20]} />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}/20`, "Moyenne"]} />
                    <Bar dataKey="average" name="Moyenne">
                      {evaluationTypeAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluationTypeAnalysis.map((type, index) => (
              <Card key={index}>
                <CardHeader className={`bg-${type.color}/10`}>
                  <CardTitle>{type.name}</CardTitle>
                  <CardDescription>{type.count} évaluations</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold">{type.average.toFixed(2)}/20</div>
                  <Progress value={(type.average / 20) * 100} className="h-2 mt-2" />

                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      {type.average > studentData.generalAverage
                        ? `+${(type.average - studentData.generalAverage).toFixed(2)} points par rapport à votre moyenne générale`
                        : `${(type.average - studentData.generalAverage).toFixed(2)} points par rapport à votre moyenne générale`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="variation" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Variation des notes par matière</CardTitle>
              <CardDescription>Analyse de la stabilité de vos résultats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="average" name="Moyenne" unit="/20" domain={[0, 20]} />
                    <YAxis type="number" dataKey="stdDev" name="Écart-type" domain={[0, "auto"]} />
                    <ZAxis type="number" dataKey="count" range={[50, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value, name) => {
                        if (name === "Moyenne") return [`${Number(value).toFixed(2)}/20`, name]
                        if (name === "Écart-type") return [Number(value).toFixed(2), name]
                        return [value, name]
                      }}
                    />
                    <Scatter name="Matières" data={variationData} fill="#8884d8">
                      {variationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.stdDev > 2 ? "#ef4444" : entry.stdDev > 1 ? "#f97316" : "#10b981"}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                <p>
                  Chaque point représente une matière. L'axe X montre la moyenne, l'axe Y l'écart-type (variabilité).
                </p>
                <p>
                  Les couleurs indiquent la stabilité : <span className="text-green-600">verte</span> = stable,{" "}
                  <span className="text-orange-600">orange</span> = moyenne, <span className="text-red-600">rouge</span>{" "}
                  = instable.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2">Matière</th>
                  <th className="text-center p-2">Moyenne</th>
                  <th className="text-center p-2">Minimum</th>
                  <th className="text-center p-2">Maximum</th>
                  <th className="text-center p-2">Écart</th>
                  <th className="text-center p-2">Écart-Type</th>
                  <th className="text-center p-2">Stabilité</th>
                </tr>
              </thead>
              <tbody>
                {variationData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="text-left p-2 font-medium">{data.subject}</td>
                    <td className="text-center p-2">{data.average.toFixed(2)}</td>
                    <td className="text-center p-2">{data.minimum.toFixed(1)}</td>
                    <td className="text-center p-2">{data.maximum.toFixed(1)}</td>
                    <td className="text-center p-2">{data.range.toFixed(1)}</td>
                    <td className="text-center p-2">{data.stdDev.toFixed(2)}</td>
                    <td className="text-center p-2">
                      <Badge
                        className={`${
                          data.stdDev > 2
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : data.stdDev > 1
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-green-100 text-green-800 hover:bg-green-100"
                        }`}
                      >
                        {data.stdDev > 2 ? "Instable" : data.stdDev > 1 ? "Moyenne" : "Stable"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

