import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";

describe("Button component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-ds-variant", "primary");
  });

  it("applies specified variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-ds-variant", "secondary");
  });

  it("applies specified size", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-ds-size", "lg");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-ds-loading", "");
  });

  it("shows loading text when loading", () => {
    render(
      <Button loading loadingText="Saving...">
        Save
      </Button>,
    );
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("applies fullWidth class when fullWidth prop is true", () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
  });

  it("renders with icon on left", () => {
    render(
      <Button iconLeft={<span data-testid="icon">Icon</span>}>
        With Icon
      </Button>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders with icon on right", () => {
    render(
      <Button iconRight={<span data-testid="icon">Icon</span>}>
        With Icon
      </Button>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it("applies data-ds attributes", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-ds", "");
    expect(button).toHaveAttribute("data-ds-component", "button");
  });
});
