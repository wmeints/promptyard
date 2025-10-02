"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ArrowLeft, Plus, X, FileText, Tag, AlignLeft, Bot, Check, ChevronsUpDown, FolderOpen } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/molecules/breadcrumb"
import { cn } from "@/lib/utils"

export default function NewTemplatePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [compatibleAgents, setCompatibleAgents] = useState<string[]>([])
  const [selectedRepository, setSelectedRepository] = useState<string>("")
  const [repositoryOpen, setRepositoryOpen] = useState(false)

  const agents = ["Microsoft Copilot", "Github Copilot", "Claude", "Claude Code", "Cursor"]

  const repositories = [
    { id: "1", name: "AI Writing Prompts", description: "Collection of writing assistance prompts" },
    { id: "2", name: "Code Generation", description: "Programming and development prompts" },
    { id: "3", name: "Business Templates", description: "Professional communication templates" },
    { id: "4", name: "Creative Writing", description: "Story and creative content prompts" },
    { id: "5", name: "Data Analysis", description: "Data science and analytics prompts" },
  ]

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleAgentChange = (agent: string, checked: boolean) => {
    if (checked) {
      setCompatibleAgents([...compatibleAgents, agent])
    } else {
      setCompatibleAgents(compatibleAgents.filter((a) => a !== agent))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Template data:", { title, description, content, tags, compatibleAgents, selectedRepository })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Promptyard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb items={[{ label: "Create Template" }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Template</h1>
          <p className="text-muted-foreground">
            Create a new prompt template to share with the community or keep for personal use.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template Details
            </CardTitle>
            <CardDescription>Provide the basic information and content for your prompt template.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter template title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Repository *
                </Label>
                <Popover open={repositoryOpen} onOpenChange={setRepositoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={repositoryOpen}
                      className="w-full justify-between bg-white"
                    >
                      {selectedRepository
                        ? repositories.find((repo) => repo.id === selectedRepository)?.name
                        : "Select repository..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search repositories..." />
                      <CommandList>
                        <CommandEmpty>No repository found.</CommandEmpty>
                        <CommandGroup>
                          {repositories.map((repo) => (
                            <CommandItem
                              key={repo.id}
                              value={repo.name}
                              onSelect={() => {
                                setSelectedRepository(repo.id)
                                setRepositoryOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedRepository === repo.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{repo.name}</span>
                                <span className="text-xs text-muted-foreground">{repo.description}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Choose the repository where this template will be stored.
                </p>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this template does and how to use it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Template Content *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your prompt template content here using markdown formatting..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">You can use markdown formatting for better readability.</p>
              </div>

              {/* Tags Field */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags (Optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag} disabled={!currentTag.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Agent Compatibility section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Agent Compatibility
                </Label>
                <p className="text-xs text-muted-foreground">
                  Select which AI agents this template is compatible with.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {agents.map((agent) => (
                    <div key={agent} className="flex items-center space-x-2">
                      <Checkbox
                        id={agent}
                        checked={compatibleAgents.includes(agent)}
                        onCheckedChange={(checked) => handleAgentChange(agent, checked as boolean)}
                      />
                      <Label htmlFor={agent} className="text-sm font-normal cursor-pointer">
                        {agent}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={!selectedRepository}>
                  Create Template
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
