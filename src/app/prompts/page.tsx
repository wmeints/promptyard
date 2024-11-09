"use client";

import { useState, useEffect } from "react";
import RestrictedContent from "@/components/RestrictedContent";
import PageContent from "@/components/PageContent";
import Pagination from "@/components/Pagination";
import prisma from "@/lib/persistence";
import { getSession } from "next-auth/react";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPrompts() {
      const session = await getSession();
      if (session) {
        const response = await fetch(`/api/prompts?page=${currentPage}`);
        const data = await response.json();
        setPrompts(data.prompts);
        setTotalPages(data.totalPages);
      }
    }
    fetchPrompts();
  }, [currentPage]);

  return (
    <RestrictedContent>
      <PageContent title="My Prompts">
        <ul>
          {prompts.map((prompt) => (
            <li key={prompt.id}>{prompt.content}</li>
          ))}
        </ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </PageContent>
    </RestrictedContent>
  );
}
