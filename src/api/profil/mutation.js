import { useMutation } from "@tanstack/react-query";
import { fetchChangePassword } from ".";

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["profile-change-password"],
    mutationFn: (body) => fetchChangePassword(body),
  });
};
