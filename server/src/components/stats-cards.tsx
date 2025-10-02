import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Heart, ThumbsUp, TrendingUp } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Repositories Owned",
      value: "24",
      description: "Active repositories",
      icon: GitBranch,
      trend: "+3 this month",
    },
    {
      title: "Total Favorites",
      value: "1,247",
      description: "Across all content",
      icon: Heart,
      trend: "+89 this week",
    },
    {
      title: "Total Upvotes",
      value: "3,892",
      description: "Community recognition",
      icon: ThumbsUp,
      trend: "+156 this week",
    },
    {
      title: "Engagement Rate",
      value: "94.2%",
      description: "User interaction",
      icon: TrendingUp,
      trend: "+2.1% this month",
    },
  ]

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-2">{stat.description}</p>
              <p className="text-xs text-accent font-medium">{stat.trend}</p>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
