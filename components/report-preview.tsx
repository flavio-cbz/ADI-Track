"use client"

import type { StudentData } from "@/types/grades"

interface ReportPreviewProps {
  studentData: StudentData
  options: {
    title: string
    subtitle: string
    includeCharts: boolean
    includeDetailedGrades: boolean
    teacherComment: string
    signatureDate: string
  }
}

export function ReportPreview({ studentData, options }: ReportPreviewProps) {
  return (
    <div className="w-full h-full overflow-auto bg-white p-4 text-xs border rounded shadow-sm">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">{options.title}</h2>
        <p className="text-sm text-slate-600">{options.subtitle}</p>
      </div>

      <div className="mb-4 border-b pb-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p>
              <strong>Étudiant:</strong> {studentData.studentInfo.name}
            </p>
            <p>
              <strong>Né le:</strong> {studentData.studentInfo.birthDate}
            </p>
            <p>
              <strong>INE:</strong> {studentData.studentInfo.ine}
            </p>
          </div>
          <div>
            <p>
              <strong>Promotion:</strong> {studentData.studentInfo.class}
            </p>
            <p>
              <strong>Rang:</strong> {studentData.studentInfo.rank}/{studentData.totalStudents}
            </p>
            <p>
              <strong>Crédits validés:</strong> {studentData.validatedCredits}/{studentData.totalCredits}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-1">Moyennes générales</h3>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="border rounded p-1 text-center">
            <p className="text-xs text-slate-600">Moyenne générale</p>
            <p className="font-bold text-sm">{studentData.generalAverage.toFixed(2)}/20</p>
          </div>
          <div className="border rounded p-1 text-center">
            <p className="text-xs text-slate-600">Crédits validés</p>
            <p className="font-bold text-sm">
              {studentData.validatedCredits}/{studentData.totalCredits}
            </p>
          </div>
          <div className="border rounded p-1 text-center">
            <p className="text-xs text-slate-600">Classement</p>
            <p className="font-bold text-sm">
              {studentData.studentInfo.rank}/{studentData.totalStudents}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-1">Unités d'enseignement</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-1 text-left">UE</th>
              <th className="border p-1 text-center">ECTS</th>
              <th className="border p-1 text-center">Moyenne</th>
              <th className="border p-1 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {studentData.unitAverages.slice(0, 3).map((unit, index) => (
              <tr key={index}>
                <td className="border p-1">{unit.unitName}</td>
                <td className="border p-1 text-center">{unit.credits}</td>
                <td className="border p-1 text-center font-medium">{unit.average.toFixed(2)}</td>
                <td className="border p-1 text-center">
                  <span
                    className={`inline-block px-1 py-0.5 rounded-sm text-[10px] ${
                      unit.average >= 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {unit.average >= 10 ? "Validé" : "Non validé"}
                  </span>
                </td>
              </tr>
            ))}
            {studentData.unitAverages.length > 3 && (
              <tr>
                <td colSpan={4} className="text-center p-1 text-slate-500">
                  ... et {studentData.unitAverages.length - 3} autres UE
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {options.includeDetailedGrades && (
        <div className="mb-4">
          <h3 className="font-bold mb-1">Détail des notes (aperçu)</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-1 text-left">Matière</th>
                <th className="border p-1 text-center">Note</th>
                <th className="border p-1 text-center">Coef.</th>
              </tr>
            </thead>
            <tbody>
              {studentData.grades.slice(0, 3).map((grade, index) => (
                <tr key={index}>
                  <td className="border p-1">{grade.subject}</td>
                  <td className="border p-1 text-center">{grade.grade.toFixed(2)}</td>
                  <td className="border p-1 text-center">{grade.coefficient}</td>
                </tr>
              ))}
              {studentData.grades.length > 3 && (
                <tr>
                  <td colSpan={3} className="text-center p-1 text-slate-500">
                    ... et {studentData.grades.length - 3} autres notes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {options.teacherComment && (
        <div className="mb-4">
          <h3 className="font-bold mb-1">Commentaire</h3>
          <p className="border p-2 text-xs italic">{options.teacherComment}</p>
        </div>
      )}

      <div className="text-right mt-4">
        <p className="text-xs">Fait le {new Date(options.signatureDate).toLocaleDateString("fr-FR")}</p>
        <p className="text-xs mt-1">Signature du responsable</p>
      </div>
    </div>
  )
}

