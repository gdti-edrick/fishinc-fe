import { useMutation } from "@tanstack/react-query";
import { fetchAddGame, fetchDeleteGame, fetchUpdateGame } from ".";

export const useAddGame = () => {
  return useMutation({
    mutationKey: ["add-game"],
    mutationFn: (body) => fetchAddGame(body),
  });
};
export const useUpdateGame = () => {
  return useMutation({
    mutationKey: ["update-game"],
    mutationFn: (body) => fetchUpdateGame(body),
  });
};
export const useDeleteGame = () => {
  return useMutation({
    mutationKey: ["delete-game"],
    mutationFn: (body) => fetchDeleteGame(body),
  });
};
