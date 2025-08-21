import { useMutation } from "@tanstack/react-query";
import { fetchAddHoliday, fetchDeleteHoliday, fetchUpdateHoliday } from ".";

export const useAddHoliday = () => {
  return useMutation({
    mutationKey: ["add-holiday"],
    mutationFn: (body) => fetchAddHoliday(body),
  });
};
export const useUpdateHoliday = () => {
  return useMutation({
    mutationKey: ["update-holiday"],
    mutationFn: (body) => fetchUpdateHoliday(body),
  });
};
export const useDeleteHoliday = () => {
  return useMutation({
    mutationKey: ["delete-holiday"],
    mutationFn: (body) => fetchDeleteHoliday(body),
  });
};
