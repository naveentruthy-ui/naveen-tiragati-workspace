import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VehicleForm from "../page";

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  }),
) as jest.Mock;

describe("VehicleForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form correctly", () => {
    render(<VehicleForm />);

    expect(screen.getByText("Vehicle Form")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Upload logbook (.txt)")).toBeInTheDocument();
  });

  test("model dropdown is disabled initially", () => {
    render(<VehicleForm />);

    const modelSelect = screen.getByDisplayValue("Select Model");
    expect(modelSelect).toBeDisabled();
  });

  test("selecting make enables model dropdown", async () => {
    render(<VehicleForm />);

    const makeSelect = screen.getByDisplayValue("Select Make");

    await userEvent.selectOptions(makeSelect, "ford");

    const modelSelect = screen.getByDisplayValue("Select Model");
    expect(modelSelect).not.toBeDisabled();
  });

  test("quick select fills form", async () => {
    render(<VehicleForm />);

    const quickButton = screen.getByText("ford Ranger Raptor");

    await userEvent.click(quickButton);

    expect(screen.getByDisplayValue("ford")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ranger")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Raptor")).toBeInTheDocument();
  });

  test("file upload updates UI", async () => {
    render(<VehicleForm />);

    const file = new File(["test log"], "test.txt", { type: "text/plain" });

    const input = screen.getByLabelText(/upload logbook/i);

    await userEvent.upload(input, file);

    expect(screen.getByText("test.txt")).toBeInTheDocument();
  });

  test("submit button is disabled if form incomplete", () => {
    render(<VehicleForm />);

    const submitBtn = screen.getByText("Submit");
    expect(submitBtn).toBeDisabled();
  });

  test("shows spinner and success popup on submit", async () => {
    render(<VehicleForm />);

    // Fill form
    await userEvent.selectOptions(
      screen.getByDisplayValue("Select Make"),
      "ford",
    );
    await userEvent.selectOptions(
      screen.getByDisplayValue("Select Model"),
      "Ranger",
    );
    await userEvent.selectOptions(
      screen.getByDisplayValue("Select Badge"),
      "Raptor",
    );

    const file = new File(["log content"], "log.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/upload logbook/i);
    await userEvent.upload(input, file);

    const submitBtn = screen.getByText("Submit");

    await userEvent.click(submitBtn);

    // Spinner should appear
    expect(submitBtn.querySelector("span")).toBeInTheDocument();

    // Wait for success popup
    await waitFor(() => {
      expect(
        screen.getByText("✅ Submitted successfully!"),
      ).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
