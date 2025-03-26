import { GradeTracker } from "@/components/grade-tracker"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            ADITrack
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-center text-muted-foreground mb-8">Suivez et personnalisez vos notes ADIMAKER</p>
        <GradeTracker />
      </div>
    </main>
  )
}

