import { useEffect, useState } from "react";

export default function useWindowSize() {
  // Initial state set to current window dimensions or undefined for SSR
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : undefined,
    height: typeof window !== "undefined" ? window.innerHeight : undefined,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return; // Early return for SSR

    function handleResize() {
      // Update state with new window dimensions
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Call handleResize immediately to set initial size
    handleResize();

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures effect runs only on mount/unmount

  return windowSize; // Return the current window size
}
