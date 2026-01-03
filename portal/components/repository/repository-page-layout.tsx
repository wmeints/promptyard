"use client";

import { FileText, Sparkles, Bot } from "lucide-react";

import { RepositoryHeader } from "./repository-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentList } from "@/components/content-list";
import {
    ContentCard,
    ContentCardHeader,
    ContentCardIcon,
    ContentCardTitle,
    ContentCardDescription,
    ContentCardTags,
    ContentCardStats,
} from "@/components/content-card";

interface Agent {
    id: string;
    name: string;
    description: string;
    tags: string[];
    favorites: number;
}

interface Prompt {
    id: string;
    title: string;
    description: string;
    tags: string[];
    favorites: number;
}

interface Skill {
    id: string;
    title: string;
    description: string;
    tags: string[];
    favorites: number;
}

interface RepositoryPageLayoutProps {
    name: string;
    description?: string | null;
    agents: Agent[];
    prompts: Prompt[];
    skills: Skill[];
    onCreateSkill?: () => void;
    onCreatePrompt?: () => void;
    onCreateAgent?: () => void;
    onEditDetails?: () => void;
    onChangeSettings?: () => void;
    onManagePermissions?: () => void;
}

function RepositoryPageLayout({
    name,
    description,
    agents,
    prompts,
    skills,
    onCreateSkill,
    onCreatePrompt,
    onCreateAgent,
    onEditDetails,
    onChangeSettings,
    onManagePermissions,
}: RepositoryPageLayoutProps) {
    return (
        <div className="container py-8 mx-auto">
            <RepositoryHeader
                name={name}
                description={description}
                onCreateSkill={onCreateSkill}
                onCreatePrompt={onCreatePrompt}
                onCreateAgent={onCreateAgent}
                onEditDetails={onEditDetails}
                onChangeSettings={onChangeSettings}
                onManagePermissions={onManagePermissions}
            />

            <Tabs defaultValue="agents" className="mt-6">
                <TabsList>
                    <TabsTrigger value="agents">
                        <Bot className="size-4" />
                        Agents
                    </TabsTrigger>
                    <TabsTrigger value="prompts">
                        <FileText className="size-4" />
                        Prompts
                    </TabsTrigger>
                    <TabsTrigger value="skills">
                        <Sparkles className="size-4" />
                        Skills
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="agents" className="mt-6">
                    <ContentList
                        items={agents}
                        emptyMessage="No agents found in this repository. Create your first agent to get started."
                        renderItem={(agent) => (
                            <ContentCard variant="outline" key={agent.id}>
                                <ContentCardHeader>
                                    <ContentCardIcon icon={Bot} />
                                    <ContentCardTitle>
                                        {agent.name}
                                    </ContentCardTitle>
                                </ContentCardHeader>
                                <ContentCardDescription truncate>
                                    {agent.description}
                                </ContentCardDescription>
                                <ContentCardTags tags={agent.tags} max={3} />
                                <ContentCardStats favorites={agent.favorites} />
                            </ContentCard>
                        )}
                    />
                </TabsContent>

                <TabsContent value="prompts" className="mt-6">
                    <ContentList
                        items={prompts}
                        emptyMessage="No prompts found in this repository. Create your first prompt to get started."
                        renderItem={(prompt) => (
                            <ContentCard variant="outline" key={prompt.id}>
                                <ContentCardHeader>
                                    <ContentCardIcon icon={FileText} />
                                    <ContentCardTitle>
                                        {prompt.title}
                                    </ContentCardTitle>
                                </ContentCardHeader>
                                <ContentCardDescription truncate>
                                    {prompt.description}
                                </ContentCardDescription>
                                <ContentCardTags tags={prompt.tags} max={3} />
                                <ContentCardStats
                                    favorites={prompt.favorites}
                                />
                            </ContentCard>
                        )}
                    />
                </TabsContent>

                <TabsContent value="skills" className="mt-6">
                    <ContentList
                        items={skills}
                        emptyMessage="No skills found in this repository. Create your first skill to get started."
                        renderItem={(skill) => (
                            <ContentCard variant="outline" key={skill.id}>
                                <ContentCardHeader>
                                    <ContentCardIcon icon={Sparkles} />
                                    <ContentCardTitle>
                                        {skill.title}
                                    </ContentCardTitle>
                                </ContentCardHeader>
                                <ContentCardDescription truncate>
                                    {skill.description}
                                </ContentCardDescription>
                                <ContentCardTags tags={skill.tags} max={3} />
                                <ContentCardStats favorites={skill.favorites} />
                            </ContentCard>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export { RepositoryPageLayout };
export type { RepositoryPageLayoutProps, Agent, Prompt, Skill };
