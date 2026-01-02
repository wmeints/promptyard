"use client"

import * as React from "react"
import { Plus, Settings, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RepositoryHeaderProps extends React.ComponentProps<"header"> {
  name: string
  description?: string | null
  onCreateSkill?: () => void
  onCreatePrompt?: () => void
  onCreateAgent?: () => void
  onEditDetails?: () => void
  onChangeSettings?: () => void
  onManagePermissions?: () => void
}

function RepositoryHeader({
  name,
  description,
  onCreateSkill,
  onCreatePrompt,
  onCreateAgent,
  onEditDetails,
  onChangeSettings,
  onManagePermissions,
  className,
  ...props
}: RepositoryHeaderProps) {
  return (
    <header
      data-slot="repository-header"
      className={cn("flex flex-col gap-4 pb-6 border-b", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Create
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onCreateSkill}>Skill</DropdownMenuItem>
              <DropdownMenuItem onClick={onCreatePrompt}>Prompt</DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateAgent}>Agent</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="size-4" />
                Manage
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditDetails}>
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onChangeSettings}>
                Change Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onManagePermissions}>
                Manage Permissions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export { RepositoryHeader }
export type { RepositoryHeaderProps }
