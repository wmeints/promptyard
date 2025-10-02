"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Search, Heart, ThumbsUp, ChevronLeft, ChevronRight, Code, FileText } from "lucide-react"
import { Breadcrumb } from "@/components/molecules/breadcrumb"

// Mock data for repository details
const mockRepository = {
  id: 1,
  title: "AI Writing Assistant Prompts",
  description:
    "A comprehensive collection of prompts for creative writing, technical documentation, and content creation. This repository contains carefully crafted templates that help writers, content creators, and professionals generate high-quality text across various domains.",
  favorites: 234,
  upvotes: 567,
  templateCount: 45,
  lastUpdated: "2 days ago",
  tags: ["Writing", "Content", "Creative"],
  author: "John Doe",
  created: "3 months ago",
}

// Mock data for prompt templates
const mockTemplates = [
  {
    id: 1,
    title: "Blog Post Outline Generator",
    description: "Creates structured outlines for blog posts with engaging headlines and key points.",
    favorites: 45,
    upvotes: 89,
    tags: ["Blog", "Writing", "Content"],
    lastUpdated: "1 day ago",
    agents: ["Claude", "GPT-4", "Cursor"],
  },
  {
    id: 2,
    title: "Technical Documentation Writer",
    description: "Generates clear, comprehensive technical documentation for software projects.",
    favorites: 67,
    upvotes: 123,
    tags: ["Technical", "Documentation", "Software"],
    lastUpdated: "3 days ago",
    agents: ["Claude Code", "Github Copilot", "Cursor"],
  },
  {
    id: 3,
    title: "Creative Story Starter",
    description: "Provides compelling story beginnings and character development prompts.",
    favorites: 34,
    upvotes: 78,
    tags: ["Creative", "Fiction", "Storytelling"],
    lastUpdated: "5 days ago",
    agents: ["Claude", "GPT-4"],
  },
  {
    id: 4,
    title: "Email Marketing Copy",
    description: "Creates persuasive email marketing content with strong calls-to-action.",
    favorites: 56,
    upvotes: 112,
    tags: ["Marketing", "Email", "Copywriting"],
    lastUpdated: "1 week ago",
    agents: ["Claude", "GPT-4", "Microsoft Copilot"],
  },
  {
    id: 5,
    title: "Social Media Post Generator",
    description: "Generates engaging social media content optimized for different platforms.",
    favorites: 78,
    upvotes: 145,
    tags: ["Social Media", "Marketing", "Content"],
    lastUpdated: "2 days ago",
    agents: ["Claude", "GPT-4"],
  },
  {
    id: 6,
    title: "Product Description Writer",
    description: "Creates compelling product descriptions that highlight features and benefits.",
    favorites: 43,
    upvotes: 87,
    tags: ["E-commerce", "Product", "Marketing"],
    lastUpdated: "4 days ago",
    agents: ["Claude", "GPT-4", "Microsoft Copilot"],
  },
  {
    id: 7,
    title: "Press Release Template",
    description: "Professional press release format with industry-standard structure.",
    favorites: 29,
    upvotes: 56,
    tags: ["PR", "News", "Business"],
    lastUpdated: "1 week ago",
    agents: ["Claude", "GPT-4"],
  },
  {
    id: 8,
    title: "Academic Essay Outline",
    description: "Structured approach to academic writing with proper citation guidelines.",
    favorites: 38,
    upvotes: 72,
    tags: ["Academic", "Essay", "Research"],
    lastUpdated: "6 days ago",
    agents: ["Claude", "GPT-4", "Cursor"],
  },
  {
    id: 9,
    title: "Newsletter Content Creator",
    description: "Generates engaging newsletter content with subscriber retention focus.",
    favorites: 52,
    upvotes: 98,
    tags: ["Newsletter", "Content", "Email"],
    lastUpdated: "3 days ago",
    agents: ["Claude", "GPT-4"],
  },
  {
    id: 10,
    title: "SEO Article Writer",
    description: "Creates SEO-optimized articles with keyword integration and meta descriptions.",
    favorites: 61,
    upvotes: 134,
    tags: ["SEO", "Article", "Content"],
    lastUpdated: "2 days ago",
    agents: ["Claude", "GPT-4", "Microsoft Copilot"],
  },
  {
    id: 11,
    title: "Video Script Template",
    description: "Professional video script format for educational and marketing content.",
    favorites: 35,
    upvotes: 67,
    tags: ["Video", "Script", "Content"],
    lastUpdated: "1 week ago",
    agents: ["Claude", "GPT-4"],
  },
  {
    id: 12,
    title: "Podcast Episode Planner",
    description: "Structured planning template for podcast episodes with talking points.",
    favorites: 27,
    upvotes: 54,
    tags: ["Podcast", "Planning", "Content"],
    lastUpdated: "5 days ago",
    agents: ["Claude", "GPT-4", "Cursor"],
  },
]

const ITEMS_PER_PAGE = 10

export default function RepositoryDetailsPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter templates based on search query
  const filteredTemplates = mockTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Promptyard</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Repositories", href: "/" }, { label: mockRepository.title }]} />

        {/* Repository Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground text-balance">{mockRepository.title}</h1>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" className="p-2 bg-transparent">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2 bg-transparent">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button size="lg" className="flex items-center gap-2" asChild>
                    <a href={`/repositories/${params.id}/templates/new`}>
                      <Plus className="h-5 w-5" />
                      Create New Template
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-lg text-muted-foreground text-pretty mb-4">{mockRepository.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mockRepository.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{mockRepository.favorites} favorites</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{mockRepository.upvotes} upvotes</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{mockRepository.templateCount} templates</span>
                </div>
                <span>Updated {mockRepository.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Templates Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Prompt Templates</h2>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Templates Grid */}
          {currentTemplates.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {currentTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 text-balance">
                            <a
                              href={`/repositories/${params.id}/templates/${template.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {template.title}
                            </a>
                          </CardTitle>
                          <CardDescription className="text-pretty">{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.agents.map((agent) => (
                          <Badge key={agent} variant="outline" className="text-xs flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            {agent}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {template.lastUpdated}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{template.favorites}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{template.upvotes}</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/repositories/${params.id}/templates/${template.id}`}>View Template</a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredTemplates.length)} of{" "}
                    {filteredTemplates.length} templates
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 bg-transparent"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms." : "This repository doesn't have any templates yet."}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <a href={`/repositories/${params.id}/templates/new`}>Create First Template</a>
                </Button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
