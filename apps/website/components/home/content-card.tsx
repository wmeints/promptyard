import { Star } from "lucide-react";

import type { ContentItem } from "@/components/home/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const typeLabels: Record<ContentItem["type"], string> = {
  skill: "Skill",
  agent: "Agent",
};

export function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between gap-2 px-5 pt-5 [.border-b]:pb-0">
        <Badge variant="secondary" className="uppercase">
          {typeLabels[item.type]}
        </Badge>
        <span className="text-xs text-muted-foreground">{item.updatedLabel}</span>
      </CardHeader>
      <CardContent className="px-5 pt-3">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-mono text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-4 justify-between border-t px-5 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarFallback className="text-xs">
              {item.author.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{item.author}</span>
        </div>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          {item.stars}
        </span>
      </CardFooter>
    </Card>
  );
}
