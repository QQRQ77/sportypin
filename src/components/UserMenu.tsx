import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-red-100 cursor-pointer">Twoje menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/user_page">
              <span className="text-sm">Moja strona</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/events/new_event">
              <span className="text-sm">Dodaj wydarzenie</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/venue/new_venue">
              <span className="text-sm">Dodaj obiekt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/teams/new_team">
              <span className="text-sm">Dodaj zespół</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/athlete/new_athlete">
              <span className="text-sm">Dodaj zawodnika</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}