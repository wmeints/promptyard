import { Button } from "@/components/ui/button"
import { Plus, GitBranch } from "lucide-react"
import { StatsCards } from "@/components/stats-cards"
import { RepositoryList } from "@/components/repository-list"

export default function HomePage() {
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
              <h1 className="text-xl font-bold text-foreground">
                <a href="/" className="hover:text-primary transition-colors">
                  Promptyard
                </a>
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Templates
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Repositories
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Community
              </a>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/signin">Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/signup">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Welcome to Your Prompt Dashboard</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Manage your prompt templates and repositories, track community engagement, and discover new ways to enhance
            your AI workflows.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="flex items-center gap-2" asChild>
              <a href="/templates/new">
                <Plus className="h-5 w-5" />
                Create New Template
              </a>
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent" asChild>
              <a href="/repositories/new">
                <GitBranch className="h-5 w-5" />
                Create New Repository
              </a>
            </Button>
          </div>
        </section>

        {/* Statistics Dashboard */}
        <StatsCards />

        {/* User's Repositories */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Your Repositories</h3>
          </div>
          <RepositoryList />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">P</span>
                </div>
                <span className="font-bold text-foreground">Promptyard</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The community platform for sharing and discovering AI prompt templates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Repositories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Promptyard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
