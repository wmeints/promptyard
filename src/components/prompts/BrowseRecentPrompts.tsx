"use client"

import PromptList from "./PromptList";
import { useEffect, useState } from "react";
import { Prompt } from "@prisma/client";

export default function BrowseRecentPrompts() {
    "use client"

    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function loadPromptData() {
            const response = await fetch(`/api/prompts/recent?pageIndex=${currentPage - 1}&pageSize=10`);
            const { items, totalPages } = await response.json();

            setPrompts(items);
            setNumPages(totalPages);
        }

        loadPromptData();
    }, [currentPage])

    return (
        <PromptList
            prompts={prompts}
            currentPage={currentPage}
            totalPages={numPages}
            onPageChange={(page) => setCurrentPage(page)}
            showPagination={false}
        />
    )
}