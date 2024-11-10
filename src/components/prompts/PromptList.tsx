"use client"

import Pagination from "@/components/shared/Pagination";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { Prompt } from "@prisma/client";
import Link from "next/link"

interface PromptListProps {
    prompts: Prompt[];
    totalPages: number;
    currentPage: number;
    onPageChange?: (page: number) => void;
    showPagination?: boolean;
}

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

function EmptyList() {
    return (
        <Link
            href="/prompts/new"
            type="button"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new prompt</span>
        </Link>
    )
}

function ListWithItems(props: PromptListProps) {
    const showPagination = props.showPagination == undefined ? true : props.showPagination;

    return (
        <>
            <ul role="list">
                {props.prompts.map((prompt) => (
                    <PromptListItem key={prompt.id} prompt={prompt} />
                ))}
            </ul>
            {showPagination && <Pagination currentPage={props.currentPage} totalPages={props.totalPages} onPageChange={props.onPageChange} />}
        </>
    )
}

export default function PromptList(props: PromptListProps) {
    return (props.totalPages > 0 ? <ListWithItems {...props} /> : <EmptyList />)
}