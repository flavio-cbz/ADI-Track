"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { runVerification } from "@/lib/grade-verification"

export function VerificationResults() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Exécuter la vérification au chargement du composant
    const verificationResults = runVerification()
    setResults(verificationResults)
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Chargement des résultats de vérification...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérification des calculs de moyennes</CardTitle>
        <CardDescription>Comparaison entre les moyennes calculées et celles du bulletin officiel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Moyennes par UE</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unité d'enseignement</TableHead>
                  <TableHead className="text-right">Calculée</TableHead>
                  <TableHead className="text-right">Bulletin</TableHead>
                  <TableHead className="text-right">Différence</TableHead>
                  <TableHead className="text-center">Correspondance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.unitAverages.map((result: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.unit}</TableCell>
                    <TableCell className="text-right">{result.calculatedAverage.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{result.bulletinAverage.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{result.difference.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {result.match ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Check className="h-4 w-4 mr-1" /> Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="h-4 w-4 mr-1" /> Écart
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Moyenne générale</h3>
            <div className="bg-muted p-4 rounded-md flex items-center justify-between">
              <div>
                <span className="font-medium">Calculée: </span>
                <span className="text-lg">{results.generalAverage.calculatedAverage.toFixed(2)}</span>
                <span className="text-muted-foreground ml-2">
                  (Bulletin: {results.generalAverage.bulletinAverage.toFixed(2)})
                </span>
              </div>
              <div>
                <span className="font-medium mr-2">Différence: </span>
                <span>{results.generalAverage.difference.toFixed(2)}</span>
                {results.generalAverage.match ? (
                  <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                    <Check className="h-4 w-4 mr-1" /> Correct
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="ml-2">
                    <X className="h-4 w-4 mr-1" /> Écart
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Moyennes par matière</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead>
                  <TableHead className="text-right">Moyenne calculée</TableHead>
                  <TableHead>UE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.subjectAverages
                  .filter((result: any) => result.calculatedAverage > 0)
                  .sort((a: any, b: any) => a.subject.localeCompare(b.subject))
                  .map((result: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
                      <TableCell className="text-right">{result.calculatedAverage.toFixed(2)}</TableCell>
                      <TableCell>{result.unit}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

