import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

// Remove global mock for this specific test
jest.unmock("./useDebounce");

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes with default delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "updated", delay: 300 });
    
    // Value should still be initial immediately after rerender
    expect(result.current).toBe("initial");

    // Fast-forward time by 299ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    // Fast-forward time by 1ms more (300ms total, equal to delay)
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should use custom delay when provided", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    rerender({ value: "updated", delay: 500 });

    // Should not update before custom delay
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial");

    // Should update after custom delay
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    // First change
    rerender({ value: "change1", delay: 300 });
    
    // Value should still be initial immediately
    expect(result.current).toBe("initial");
    
    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    // Second change before first timer completes
    rerender({ value: "change2", delay: 300 });

    // Advance time by the remaining original time
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("initial"); // Should still be initial

    // Complete the new timer
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("change2"); // Should be the latest value
  });

  it("should handle delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    // Change both value and delay
    rerender({ value: "updated", delay: 100 });

    // Should update after the new shorter delay
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("updated");
  });

  it("should handle empty string values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "", delay: 300 },
      }
    );

    expect(result.current).toBe("");

    rerender({ value: "non-empty", delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("non-empty");

    rerender({ value: "", delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("");
  });

  it("should cleanup timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    
    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    // Change value to trigger timer
    rerender({ value: "updated", delay: 300 });
    
    // Clear any previous calls
    clearTimeoutSpy.mockClear();
    
    // Unmount before timer completes
    unmount();
    
    // Verify clearTimeout was called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});