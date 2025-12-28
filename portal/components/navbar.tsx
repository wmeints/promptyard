"use client"

import * as React from "react"
import Link from "next/link"
import { Search, User, LogOut, Settings, Package } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const { data: session, isPending } = useSession()
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
    }
  }

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return "U"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Logo / Brand */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Package className="size-6" />
            <span className="hidden font-bold sm:inline-block">
              PromptYard
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Categories
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search skills, agents, or prompts..."
              className="w-full pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* User Menu / Sign In */}
        <div className="flex items-center space-x-2 ml-4">
          {isPending ? (
            <div className="size-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-8 rounded-full p-0">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name || session.user.email || "User"}
                    />
                    <AvatarFallback>
                      {getUserInitials(session.user.name, session.user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/signout" className="cursor-pointer">
                    <LogOut />
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
