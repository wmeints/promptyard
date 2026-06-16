export interface ContentItem {
  id: string;
  type: "skill" | "agent";
  title: string;
  description: string;
  tags: string[];
  author: string;
  updatedLabel: string;
  stars: number;
}

// Placeholder feed for the app shell. Replaced by real data in a later issue.
export const recentUpdates: ContentItem[] = [
  {
    id: "pdf-table-extractor",
    type: "skill",
    title: "PDF Table Extractor",
    description: "Pulls clean tables out of messy PDFs into tidy CSV.",
    tags: ["data", "parsing"],
    author: "maya.k",
    updatedLabel: "2h ago",
    stars: 128,
  },
  {
    id: "release-notes-writer",
    type: "agent",
    title: "Release Notes Writer",
    description: "Drafts changelogs from your merged pull requests.",
    tags: ["devtools", "writing"],
    author: "devon",
    updatedLabel: "5h ago",
    stars: 94,
  },
  {
    id: "brand-voice-linter",
    type: "skill",
    title: "Brand Voice Linter",
    description: "Flags off-tone copy against your style guide.",
    tags: ["content"],
    author: "priya",
    updatedLabel: "1d ago",
    stars: 212,
  },
  {
    id: "sql-explainer",
    type: "agent",
    title: "SQL Explainer",
    description: "Turns gnarly queries into plain English.",
    tags: ["data", "sql"],
    author: "sam",
    updatedLabel: "1d ago",
    stars: 67,
  },
  {
    id: "meeting-recap",
    type: "skill",
    title: "Meeting Recap",
    description: "Summarizes transcripts into clear action items.",
    tags: ["productivity"],
    author: "lin",
    updatedLabel: "2d ago",
    stars: 303,
  },
  {
    id: "onboarding-buddy",
    type: "agent",
    title: "Onboarding Buddy",
    description: "Walks new hires through environment setup.",
    tags: ["hr"],
    author: "co.r",
    updatedLabel: "3d ago",
    stars: 41,
  },
];
