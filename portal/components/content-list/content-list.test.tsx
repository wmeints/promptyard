import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ContentList } from "./content-list"

interface TestItem {
  id: string
  name: string
}

const testItems: TestItem[] = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
]

const renderTestItem = (item: TestItem) => (
  <div data-testid={`item-${item.id}`}>{item.name}</div>
)

describe("ContentList", () => {
  describe("when items are provided", () => {
    it("renders all items", () => {
      render(<ContentList items={testItems} renderItem={renderTestItem} />)

      expect(screen.getByTestId("item-1")).toBeInTheDocument()
      expect(screen.getByTestId("item-2")).toBeInTheDocument()
      expect(screen.getByTestId("item-3")).toBeInTheDocument()
    })

    it("renders items using the renderItem function", () => {
      render(<ContentList items={testItems} renderItem={renderTestItem} />)

      expect(screen.getByText("Item 1")).toBeInTheDocument()
      expect(screen.getByText("Item 2")).toBeInTheDocument()
      expect(screen.getByText("Item 3")).toBeInTheDocument()
    })
  })

  describe("when items array is empty", () => {
    it("displays the empty message", () => {
      render(
        <ContentList
          items={[]}
          renderItem={renderTestItem}
          emptyMessage="No items available"
        />
      )

      expect(screen.getByText("No items available")).toBeInTheDocument()
    })

    it("displays default empty message when not provided", () => {
      render(<ContentList items={[]} renderItem={renderTestItem} />)

      expect(screen.getByText("No items found")).toBeInTheDocument()
    })
  })

  describe("when pagination is enabled", () => {
    it("renders pager when totalPages is greater than 1", () => {
      render(
        <ContentList
          items={testItems}
          renderItem={renderTestItem}
          currentPage={1}
          totalPages={3}
          onPageChange={vi.fn()}
        />
      )

      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    })

    it("does not render pager when totalPages is 1", () => {
      render(
        <ContentList
          items={testItems}
          renderItem={renderTestItem}
          currentPage={1}
          totalPages={1}
          onPageChange={vi.fn()}
        />
      )

      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument()
    })

    it("does not render pager when onPageChange is not provided", () => {
      render(
        <ContentList
          items={testItems}
          renderItem={renderTestItem}
          currentPage={1}
          totalPages={3}
        />
      )

      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument()
    })

    it("calls onPageChange when page is changed", async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()

      render(
        <ContentList
          items={testItems}
          renderItem={renderTestItem}
          currentPage={1}
          totalPages={3}
          onPageChange={onPageChange}
        />
      )

      await user.click(screen.getByRole("button", { name: /next/i }))

      expect(onPageChange).toHaveBeenCalledWith(2)
    })
  })
})
