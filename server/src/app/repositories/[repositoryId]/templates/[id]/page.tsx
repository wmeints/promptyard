"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, ThumbsUp, Edit, Code, Copy, Check, MessageCircle, Send } from "lucide-react"
import { Breadcrumb } from "@/components/molecules/breadcrumb"

// Mock data for template details
const mockTemplate = {
  id: 1,
  title: "Blog Post Outline Generator",
  description:
    "Creates structured outlines for blog posts with engaging headlines and key points. This template helps content creators develop comprehensive blog post structures with compelling introductions, detailed body sections, and strong conclusions.",
  content: `# Blog Post Outline Generator

## Instructions
You are a professional content strategist helping to create engaging blog post outlines. Generate a comprehensive outline based on the topic provided.

## Template

**Topic:** [INSERT TOPIC HERE]

**Target Audience:** [INSERT TARGET AUDIENCE]

**Word Count Goal:** [INSERT WORD COUNT]

### Blog Post Outline:

#### 1. Compelling Headline
- Main headline: [Generate 3-5 headline options]
- Subheadline (if needed): [Optional supporting text]

#### 2. Introduction (10-15% of total word count)
- Hook: [Attention-grabbing opening]
- Problem/Question: [What challenge does this address?]
- Promise: [What will readers learn/gain?]
- Preview: [Brief outline of what's covered]

#### 3. Main Body Sections
**Section 1: [Main Point 1]**
- Key insight: [Primary takeaway]
- Supporting details: [2-3 supporting points]
- Example/Case study: [Real-world application]

**Section 2: [Main Point 2]**
- Key insight: [Primary takeaway]
- Supporting details: [2-3 supporting points]
- Example/Case study: [Real-world application]

**Section 3: [Main Point 3]**
- Key insight: [Primary takeaway]
- Supporting details: [2-3 supporting points]
- Example/Case study: [Real-world application]

#### 4. Conclusion (5-10% of total word count)
- Summary: [Recap main points]
- Call-to-action: [What should readers do next?]
- Final thought: [Memorable closing statement]

#### 5. SEO Elements
- Primary keyword: [Main SEO target]
- Secondary keywords: [2-3 related terms]
- Meta description: [150-160 character summary]

## Additional Notes
- Ensure each section flows logically to the next
- Include transition sentences between sections
- Consider adding relevant statistics or quotes
- Plan for visual elements (images, infographics, etc.)`,
  favorites: 45,
  upvotes: 89,
  tags: ["Blog", "Writing", "Content"],
  agents: ["Claude", "GPT-4", "Cursor"],
  author: "John Doe",
  created: "2 weeks ago",
  lastUpdated: "1 day ago",
  repositoryId: 1,
  repositoryTitle: "AI Writing Assistant Prompts",
  isUpvoted: false,
  isFavorited: false,
}

const mockComments = [
  {
    id: 1,
    author: "Sarah Chen",
    content:
      "This template is incredibly helpful! I've been using it for my tech blog and it's streamlined my content planning process significantly. The SEO section is particularly valuable.",
    timestamp: "2 hours ago",
    upvotes: 12,
  },
  {
    id: 2,
    author: "Mike Rodriguez",
    content:
      "Great structure! I modified it slightly for my marketing blog by adding a section for competitor analysis. Would love to see a version specifically for technical tutorials.",
    timestamp: "1 day ago",
    upvotes: 8,
  },
  {
    id: 3,
    author: "Emily Watson",
    content:
      "The transition sentence reminders are gold. I always forget about flow between sections. This template keeps me organized and my posts much more readable.",
    timestamp: "3 days ago",
    upvotes: 15,
  },
  {
    id: 4,
    author: "Alex Kim",
    content:
      "Perfect for content teams! We've standardized on this template and our blog post quality has improved dramatically. The word count guidelines are spot on.",
    timestamp: "1 week ago",
    upvotes: 6,
  },
]

export default function TemplateDetailsPage({ params }: { params: { repositoryId: string; id: string } }) {
  const [isUpvoted, setIsUpvoted] = useState(mockTemplate.isUpvoted)
  const [isFavorited, setIsFavorited] = useState(mockTemplate.isFavorited)
  const [copied, setCopied] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockTemplate.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy content:", err)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setNewComment("")
    setIsSubmitting(false)
    // In real app, would refresh comments or add to state
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
              <a href={`/repositories/${params.repositoryId}`} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Repository
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: mockTemplate.repositoryTitle, href: `/repositories/${params.repositoryId}` },
            { label: mockTemplate.title },
          ]}
        />

        {/* Template Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground text-balance">{mockTemplate.title}</h1>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant={isUpvoted ? "default" : "outline"} size="sm" onClick={handleUpvote} className="p-2">
                    <ThumbsUp className={`h-4 w-4 ${isUpvoted ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant={isFavorited ? "default" : "outline"}
                    size="sm"
                    onClick={handleFavorite}
                    className="p-2"
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`/repositories/${params.repositoryId}/templates/${params.id}/edit`}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-lg text-muted-foreground text-pretty mb-4">{mockTemplate.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mockTemplate.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {mockTemplate.agents.map((agent) => (
                  <Badge key={agent} variant="outline" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {agent}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{mockTemplate.favorites} favorites</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{mockTemplate.upvotes} upvotes</span>
                </div>
                <span>By {mockTemplate.author}</span>
                <span>Created {mockTemplate.created}</span>
                <span>Updated {mockTemplate.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Repository Context */}
          <div className="text-sm text-muted-foreground mb-6">
            <span>From repository: </span>
            <a href={`/repositories/${params.repositoryId}`} className="text-primary hover:underline">
              {mockTemplate.repositoryTitle}
            </a>
          </div>
        </div>

        {/* Template Content */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Template Content</h2>
            <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2 bg-transparent">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Template
                </>
              )}
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                {mockTemplate.content}
              </pre>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="h-6 w-6 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Comments</h2>
            <span className="text-sm text-muted-foreground">({mockComments.length})</span>
          </div>

          {/* Comment Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts about this template..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">{comment.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.upvotes}</span>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
