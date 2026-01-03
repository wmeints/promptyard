import { notFound } from "next/navigation"

import { getRepositoryBySlug } from "@/lib/api"
import { RepositoryPageLayout } from "@/components/repository"

interface RepositoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const { slug } = await params
  const repository = await getRepositoryBySlug(slug)

  if (!repository) {
    notFound()
  }

  // Placeholder data - will be replaced with actual API calls
  const agents: {
    id: string
    name: string
    description: string
    tags: string[]
    favorites: number
  }[] = []
  const prompts: {
    id: string
    title: string
    description: string
    tags: string[]
    favorites: number
  }[] = []
  const skills: {
    id: string
    title: string
    description: string
    tags: string[]
    favorites: number
  }[] = []

  return (
    <RepositoryPageLayout
      name={repository.name}
      description={repository.description}
      agents={agents}
      prompts={prompts}
      skills={skills}
    />
  )
}
