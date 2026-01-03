import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Pager } from "./pager"

describe("Pager", () => {
  describe("when rendered with multiple pages", () => {
    it("displays current page and total pages", () => {
      render(
        <Pager currentPage={3} totalPages={10} onPageChange={vi.fn()} />
      )

      expect(screen.getByText("Page 3 of 10")).toBeInTheDocument()
    })

    it("renders previous and next buttons", () => {
      render(
        <Pager currentPage={5} totalPages={10} onPageChange={vi.fn()} />
      )

      expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
    })
  })

  describe("when clicking previous button", () => {
    it("calls onPageChange with previous page number", async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()

      render(
        <Pager currentPage={5} totalPages={10} onPageChange={onPageChange} />
      )

      await user.click(screen.getByRole("button", { name: /previous/i }))

      expect(onPageChange).toHaveBeenCalledWith(4)
    })
  })

  describe("when clicking next button", () => {
    it("calls onPageChange with next page number", async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()

      render(
        <Pager currentPage={5} totalPages={10} onPageChange={onPageChange} />
      )

      await user.click(screen.getByRole("button", { name: /next/i }))

      expect(onPageChange).toHaveBeenCalledWith(6)
    })
  })

  describe("when on first page", () => {
    it("disables previous button", () => {
      render(
        <Pager currentPage={1} totalPages={10} onPageChange={vi.fn()} />
      )

      expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled()
    })

    it("enables next button", () => {
      render(
        <Pager currentPage={1} totalPages={10} onPageChange={vi.fn()} />
      )

      expect(screen.getByRole("button", { name: /next/i })).toBeEnabled()
    })
  })

  describe("when on last page", () => {
    it("disables next button", () => {
      render(
        <Pager currentPage={10} totalPages={10} onPageChange={vi.fn()} />
      )

      expect(screen.getByRole("button", { name: /next/i })).toBeDisabled()
    })

    it("enables previous button", () => {
      render(
        <Pager currentPage={10} totalPages={10} onPageChange={vi.fn()} />
      )

      expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled()
    })
  })

  describe("when totalPages is 1", () => {
    it("returns null and renders nothing", () => {
      const { container } = render(
        <Pager currentPage={1} totalPages={1} onPageChange={vi.fn()} />
      )

      expect(container).toBeEmptyDOMElement()
    })
  })
})
