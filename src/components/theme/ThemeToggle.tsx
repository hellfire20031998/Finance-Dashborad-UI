import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  dark: boolean
  onToggle: () => void
  onLight: () => void
  onDark: () => void
}

export function ThemeToggle({ dark, onToggle, onLight, onDark }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Theme menu">
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onLight}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={onDark}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={onToggle}>Toggle</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
