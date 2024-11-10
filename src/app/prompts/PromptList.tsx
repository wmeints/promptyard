"use client"

import Pagination from "@/components/Pagination";
import { Prompt } from "@prisma/client";
import Link from "next/link"
import { useEffect, useState } from "react";

function PromptListItem({ prompt }: { prompt: Prompt }) {
    return (
        <li className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                    <p className="text-sm/6 font-semibold text-gray-900">{prompt.title}</p>

                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                    <p className="whitespace-nobreak">{new Date(prompt.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })}</p>
                </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
                <Link href={`/prompts/${prompt.id}`} className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">
                    View details
                </Link>
            </div>
        </li >
    )
}

export default function PromptList() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function loadPromptData() {
            const response = await fetch(`/api/prompts?pageIndex=${currentPage - 1}&pageSize=10`);
            const { items, totalPages } = await response.json();

            setPrompts(items);
            setNumPages(totalPages);
        }

        loadPromptData();
    }, [currentPage])

    return (
        <>
            <ul role="list">
                {prompts.map((prompt) => (
                    <PromptListItem key={prompt.id} prompt={prompt} />
                ))}
            </ul>
            <Pagination currentPage={currentPage} totalPages={numPages} onPageChange={(page) => setCurrentPage(page)} />
        </>
    );
}