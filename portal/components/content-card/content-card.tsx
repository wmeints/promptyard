"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const contentCardVariants = cva(
  "flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-colors",
  {
    variants: {
      variant: {
        default: "border-border",
        outline:
          "border-border shadow-xs dark:border-input dark:bg-input/30",
        ghost: "border-transparent bg-transparent hover:bg-accent/50",
      },
      size: {
        sm: "gap-2 p-3 text-sm",
        md: "gap-3 p-4",
        lg: "gap-4 p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

type ContentCardContextValue = VariantProps<typeof contentCardVariants>

const ContentCardContext = React.createContext<ContentCardContextValue>({})

function useContentCard() {
  return React.useContext(ContentCardContext)
}

interface ContentCardProps
  extends React.ComponentProps<"article">,
    VariantProps<typeof contentCardVariants> {}

function ContentCard({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: ContentCardProps) {
  return (
    <ContentCardContext.Provider value={{ variant, size }}>
      <article
        data-slot="content-card"
        data-variant={variant}
        data-size={size}
        className={cn(contentCardVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </article>
    </ContentCardContext.Provider>
  )
}

type ContentCardHeaderProps = React.ComponentProps<"div">

function ContentCardHeader({ className, ...props }: ContentCardHeaderProps) {
  return (
    <div
      data-slot="content-card-header"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

interface ContentCardIconProps extends React.ComponentProps<"div"> {
  icon: LucideIcon
}

function ContentCardIcon({
  icon: Icon,
  className,
  ...props
}: ContentCardIconProps) {
  const { size } = useContentCard()
  return (
    <div
      data-slot="content-card-icon"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
        size === "sm" && "size-8",
        size === "md" && "size-10",
        size === "lg" && "size-12",
        className
      )}
      {...props}
    >
      <Icon
        className={cn(
          size === "sm" && "size-4",
          size === "md" && "size-5",
          size === "lg" && "size-6"
        )}
      />
    </div>
  )
}

interface ContentCardTitleProps extends React.ComponentProps<"h3"> {
  asChild?: boolean
}

function ContentCardTitle({
  className,
  asChild = false,
  ...props
}: ContentCardTitleProps) {
  const Comp = asChild ? Slot : "h3"
  const { size } = useContentCard()
  return (
    <Comp
      data-slot="content-card-title"
      className={cn(
        "font-semibold leading-tight text-foreground",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        asChild &&
          "hover:underline focus-visible:underline focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

interface ContentCardDescriptionProps extends React.ComponentProps<"p"> {
  truncate?: boolean
}

function ContentCardDescription({
  className,
  truncate = false,
  ...props
}: ContentCardDescriptionProps) {
  return (
    <p
      data-slot="content-card-description"
      className={cn(
        "text-sm text-muted-foreground",
        truncate && "line-clamp-2",
        className
      )}
      {...props}
    />
  )
}

interface ContentCardTagsProps extends React.ComponentProps<"div"> {
  tags: string[]
  max?: number
}

function ContentCardTags({
  tags,
  max,
  className,
  ...props
}: ContentCardTagsProps) {
  const displayTags = max ? tags.slice(0, max) : tags
  const remainingCount = max && tags.length > max ? tags.length - max : 0

  return (
    <div
      data-slot="content-card-tags"
      className={cn("flex flex-wrap gap-1.5", className)}
      {...props}
    >
      {displayTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

interface ContentCardStatsProps extends React.ComponentProps<"div"> {
  favorites?: number
}

function ContentCardStats({
  favorites,
  className,
  ...props
}: ContentCardStatsProps) {
  return (
    <div
      data-slot="content-card-stats"
      className={cn(
        "flex items-center gap-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {favorites !== undefined && (
        <span className="inline-flex items-center gap-1">
          <Heart className="size-4" />
          {favorites}
        </span>
      )}
    </div>
  )
}

type ContentCardFooterProps = React.ComponentProps<"div">

function ContentCardFooter({ className, ...props }: ContentCardFooterProps) {
  return (
    <div
      data-slot="content-card-footer"
      className={cn(
        "flex items-center gap-2 border-t border-border pt-3 -mx-3 md:-mx-4 lg:-mx-6 px-3 md:px-4 lg:px-6 mt-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ContentCard,
  ContentCardHeader,
  ContentCardIcon,
  ContentCardTitle,
  ContentCardDescription,
  ContentCardTags,
  ContentCardStats,
  ContentCardFooter,
  contentCardVariants,
}
