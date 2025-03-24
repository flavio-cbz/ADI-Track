"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradeUploader } from "@/components/grade-uploader"
import { ManualGradeEntry } from "@/components/manual-grade-entry"
import { FileText, Edit } from "lucide-react"

interface InitialSetupProps {
  onDataProcessed: (data: any) => void
  isProcessing: boolean
  isSaving: boolean
}

export function InitialSetup({ onDataProcessed, isProcessing, isSaving }: InitialSetupProps) {
  const [activeTab, setActiveTab] = useState<string>("automatic")

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Bienvenue sur ADITrack</CardTitle>
        <CardDescription className="max-w-2xl mx-auto">
          Pour commencer, choisissez comment vous souhaitez ajouter vos notes. Vous pouvez soit importer automatiquement
          vos relevés de notes depuis Aurion, soit saisir manuellement vos notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="automatic" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Importation automatique
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Saisie manuelle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automatic" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Import depuis Aurion (relevé de notes)</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Connectez-vous à votre espace Aurion</li>
                <li>Accédez à votre relevé de notes (section "Scolarité" puis "Notes")</li>
                <li>Cliquez sur le bouton "Imprimer" en haut à droite de la page</li>
                <li>Enregistrez le document au format PDF</li>
                <li>Importez le fichier PDF ci-dessous</li>
              </ol>
              <p className="mt-2 text-sm font-medium">
                Cette méthode permet d'importer automatiquement toutes vos notes en une seule opération.
              </p>
            </div>
            <GradeUploader onDataProcessed={onDataProcessed} isProcessing={isProcessing} isSaving={isSaving} />
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Saisie manuelle des notes</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez saisir manuellement vos informations personnelles et vos notes. Vous pourrez toujours
                ajouter ou modifier des notes ultérieurement.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Important :</strong> Sélectionnez votre année d'études (ADI1 ou ADI2) car les coefficients et
                matières sont différents.
              </p>
            </div>
            <ManualGradeEntry onDataProcessed={onDataProcessed} isSaving={isSaving} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col text-center text-sm text-muted-foreground pt-4 border-t">
        <p>
          Vos données sont stockées localement dans votre navigateur et ne sont pas partagées avec des tiers. Pour plus
          d'informations sur la gestion de vos données, consultez la section "Paramètres".
        </p>
      </CardFooter>
    </Card>
  )
}

