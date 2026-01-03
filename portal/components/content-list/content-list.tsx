"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Pager } from "@/components/pager"

interface ContentListProps<T> extends React.ComponentProps<"div"> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

function ContentList<T>({
  items,
  renderItem,
  emptyMessage = "No items found",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  ...props
}: ContentListProps<T>) {
  if (items.length === 0) {
    return (
      <div
        data-slot="content-list-empty"
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
        {...props}
      >
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div data-slot="content-list" className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </div>
      {onPageChange && totalPages > 1 && (
        <Pager
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

export { ContentList }
export type { ContentListProps }
