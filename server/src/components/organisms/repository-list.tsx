"use client";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Heart,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for repositories
const mockRepositories = [
  {
    id: 1,
    title: "AI Writing Assistant Prompts",
    description:
      "A comprehensive collection of prompts for creative writing, technical documentation, and content creation.",
    favorites: 234,
    upvotes: 567,
    templateCount: 45,
    lastUpdated: "2 days ago",
    tags: ["Writing", "Content", "Creative"],
  },
  {
    id: 2,
    title: "Code Review & Analysis",
    description:
      "Specialized prompts for code review, bug detection, and software architecture analysis.",
    favorites: 189,
    upvotes: 423,
    templateCount: 32,
    lastUpdated: "1 week ago",
    tags: ["Development", "Code Review", "Analysis"],
  },
  {
    id: 3,
    title: "Data Science Workflows",
    description:
      "Prompts for data analysis, visualization suggestions, and statistical interpretation.",
    favorites: 156,
    upvotes: 298,
    templateCount: 28,
    lastUpdated: "3 days ago",
    tags: ["Data Science", "Analytics", "Statistics"],
  },
  {
    id: 4,
    title: "Marketing & SEO Content",
    description:
      "Templates for marketing copy, SEO optimization, and social media content creation.",
    favorites: 312,
    upvotes: 678,
    templateCount: 52,
    lastUpdated: "5 days ago",
    tags: ["Marketing", "SEO", "Social Media"],
  },
  {
    id: 5,
    title: "Educational Resources",
    description:
      "Prompts for creating lesson plans, educational content, and learning assessments.",
    favorites: 98,
    upvotes: 187,
    templateCount: 23,
    lastUpdated: "1 week ago",
    tags: ["Education", "Teaching", "Learning"],
  },
  {
    id: 6,
    title: "Business Strategy",
    description:
      "Strategic planning prompts, market analysis templates, and business model frameworks.",
    favorites: 145,
    upvotes: 289,
    templateCount: 19,
    lastUpdated: "4 days ago",
    tags: ["Business", "Strategy", "Planning"],
  },
  {
    id: 7,
    title: "Creative Design Briefs",
    description:
      "Prompts for generating design concepts, color palettes, and creative direction.",
    favorites: 203,
    upvotes: 445,
    templateCount: 37,
    lastUpdated: "6 days ago",
    tags: ["Design", "Creative", "Visual"],
  },
  {
    id: 8,
    title: "Research & Analysis",
    description:
      "Academic research prompts, literature review templates, and analysis frameworks.",
    favorites: 87,
    upvotes: 156,
    templateCount: 15,
    lastUpdated: "1 week ago",
    tags: ["Research", "Academic", "Analysis"],
  },
  {
    id: 9,
    title: "Customer Support Scripts",
    description:
      "Professional customer service responses, troubleshooting guides, and support workflows.",
    favorites: 167,
    upvotes: 334,
    templateCount: 41,
    lastUpdated: "2 days ago",
    tags: ["Support", "Customer Service", "Communication"],
  },
  {
    id: 10,
    title: "Project Management",
    description:
      "Templates for project planning, team coordination, and milestone tracking.",
    favorites: 124,
    upvotes: 267,
    templateCount: 26,
    lastUpdated: "3 days ago",
    tags: ["Project Management", "Planning", "Coordination"],
  },
  {
    id: 11,
    title: "Legal Document Drafting",
    description:
      "Professional legal templates, contract analysis, and compliance checking prompts.",
    favorites: 78,
    upvotes: 145,
    templateCount: 18,
    lastUpdated: "1 week ago",
    tags: ["Legal", "Contracts", "Compliance"],
  },
  {
    id: 12,
    title: "Financial Analysis",
    description:
      "Financial modeling prompts, investment analysis, and budget planning templates.",
    favorites: 156,
    upvotes: 298,
    templateCount: 22,
    lastUpdated: "5 days ago",
    tags: ["Finance", "Analysis", "Investment"],
  },
];

const ITEMS_PER_PAGE = 10;

export function RepositoryList() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockRepositories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRepositories = mockRepositories.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {/* Repository Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {currentRepositories.map((repo) => (
          <Card key={repo.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 text-balance">
                    {repo.title}
                  </CardTitle>
                  <CardDescription className="text-pretty">
                    {repo.description}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {repo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Updated {repo.lastUpdated}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{repo.favorites}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{repo.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{repo.templateCount}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/repositories/${repo.id}`}>View Repository</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, mockRepositories.length)}{" "}
          of {mockRepositories.length} repositories
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
    </div>
  );
}
