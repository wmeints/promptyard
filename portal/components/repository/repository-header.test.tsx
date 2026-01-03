import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RepositoryHeader } from "./repository-header"

describe("RepositoryHeader", () => {
  describe("when rendered", () => {
    it("displays the repository name", () => {
      render(<RepositoryHeader name="Test Repository" />)

      expect(
        screen.getByRole("heading", { name: "Test Repository" })
      ).toBeInTheDocument()
    })

    it("displays the repository description when provided", () => {
      render(
        <RepositoryHeader
          name="Test Repository"
          description="A test description"
        />
      )

      expect(screen.getByText("A test description")).toBeInTheDocument()
    })

    it("does not display description when not provided", () => {
      render(<RepositoryHeader name="Test Repository" />)

      expect(screen.queryByText(/description/i)).not.toBeInTheDocument()
    })

    it("renders Create dropdown button", () => {
      render(<RepositoryHeader name="Test Repository" />)

      expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument()
    })

    it("renders Manage dropdown button", () => {
      render(<RepositoryHeader name="Test Repository" />)

      expect(screen.getByRole("button", { name: /manage/i })).toBeInTheDocument()
    })
  })

  describe("when Create dropdown is opened", () => {
    it("shows Skill, Prompt, and Agent options", async () => {
      const user = userEvent.setup()

      render(<RepositoryHeader name="Test Repository" />)

      await user.click(screen.getByRole("button", { name: /create/i }))

      expect(screen.getByRole("menuitem", { name: "Skill" })).toBeInTheDocument()
      expect(screen.getByRole("menuitem", { name: "Prompt" })).toBeInTheDocument()
      expect(screen.getByRole("menuitem", { name: "Agent" })).toBeInTheDocument()
    })

    it("calls onCreateSkill when Skill is clicked", async () => {
      const user = userEvent.setup()
      const onCreateSkill = vi.fn()

      render(
        <RepositoryHeader name="Test Repository" onCreateSkill={onCreateSkill} />
      )

      await user.click(screen.getByRole("button", { name: /create/i }))
      await user.click(screen.getByRole("menuitem", { name: "Skill" }))

      expect(onCreateSkill).toHaveBeenCalled()
    })

    it("calls onCreatePrompt when Prompt is clicked", async () => {
      const user = userEvent.setup()
      const onCreatePrompt = vi.fn()

      render(
        <RepositoryHeader
          name="Test Repository"
          onCreatePrompt={onCreatePrompt}
        />
      )

      await user.click(screen.getByRole("button", { name: /create/i }))
      await user.click(screen.getByRole("menuitem", { name: "Prompt" }))

      expect(onCreatePrompt).toHaveBeenCalled()
    })

    it("calls onCreateAgent when Agent is clicked", async () => {
      const user = userEvent.setup()
      const onCreateAgent = vi.fn()

      render(
        <RepositoryHeader name="Test Repository" onCreateAgent={onCreateAgent} />
      )

      await user.click(screen.getByRole("button", { name: /create/i }))
      await user.click(screen.getByRole("menuitem", { name: "Agent" }))

      expect(onCreateAgent).toHaveBeenCalled()
    })
  })

  describe("when Manage dropdown is opened", () => {
    it("shows Edit Details, Change Settings, and Manage Permissions options", async () => {
      const user = userEvent.setup()

      render(<RepositoryHeader name="Test Repository" />)

      await user.click(screen.getByRole("button", { name: /manage/i }))

      expect(
        screen.getByRole("menuitem", { name: "Edit Details" })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("menuitem", { name: "Change Settings" })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("menuitem", { name: "Manage Permissions" })
      ).toBeInTheDocument()
    })

    it("calls onEditDetails when Edit Details is clicked", async () => {
      const user = userEvent.setup()
      const onEditDetails = vi.fn()

      render(
        <RepositoryHeader name="Test Repository" onEditDetails={onEditDetails} />
      )

      await user.click(screen.getByRole("button", { name: /manage/i }))
      await user.click(screen.getByRole("menuitem", { name: "Edit Details" }))

      expect(onEditDetails).toHaveBeenCalled()
    })

    it("calls onChangeSettings when Change Settings is clicked", async () => {
      const user = userEvent.setup()
      const onChangeSettings = vi.fn()

      render(
        <RepositoryHeader
          name="Test Repository"
          onChangeSettings={onChangeSettings}
        />
      )

      await user.click(screen.getByRole("button", { name: /manage/i }))
      await user.click(screen.getByRole("menuitem", { name: "Change Settings" }))

      expect(onChangeSettings).toHaveBeenCalled()
    })

    it("calls onManagePermissions when Manage Permissions is clicked", async () => {
      const user = userEvent.setup()
      const onManagePermissions = vi.fn()

      render(
        <RepositoryHeader
          name="Test Repository"
          onManagePermissions={onManagePermissions}
        />
      )

      await user.click(screen.getByRole("button", { name: /manage/i }))
      await user.click(
        screen.getByRole("menuitem", { name: "Manage Permissions" })
      )

      expect(onManagePermissions).toHaveBeenCalled()
    })
  })
})
