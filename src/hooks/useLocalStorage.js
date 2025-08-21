import { useState, useEffect, useCallback } from "react";

// Custom hook for managing user data in localStorage
export const useLocalStorageUser = () => {
  const [user, setUser] = useState(() => {
    try {
      // Initialize state from localStorage
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  // Effect to update localStorage when user state changes
  useEffect(() => {
    try {
      if (user) {
        // Stringify and store the user object in localStorage
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        // Remove user from localStorage if user is null
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  }, [user]);

  // Function to update the user state
  const updateUser = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  // Function to clear the user state
  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return { user, updateUser, clearUser };
};
