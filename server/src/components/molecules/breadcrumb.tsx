import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <a
        href="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </a>
      {items.map((item) => (
        <div
          key={item.href ?? item.label}
          className="flex items-center space-x-1"
        >
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
