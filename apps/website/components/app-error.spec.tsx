import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppErrorProvider, useAppError } from "@/components/app-error";

function Trigger() {
  const { setError } = useAppError();
  return (
    <button type="button" onClick={() => setError("Something went wrong")}>
      Break it
    </button>
  );
}

describe("AppErrorProvider", () => {
  it("shows the error bar only after an error is set and hides it on dismiss", async () => {
    const user = userEvent.setup();
    render(
      <AppErrorProvider>
        <Trigger />
      </AppErrorProvider>,
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /break it/i }));

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong");

    await user.click(screen.getByRole("button", { name: /dismiss error/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("throws when useAppError is used outside the provider", () => {
    function Orphan() {
      useAppError();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow(/AppErrorProvider/);
  });
});
