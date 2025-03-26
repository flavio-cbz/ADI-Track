import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Développé, maintenu et hébergé par{" "}
          <a
            href="https://github.com/flavio-cbz"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Flavio COMBLEZ
          </a>
          . © {new Date().getFullYear()} ADITrack. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/flavio-cbz/ADI-Track"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4 flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

