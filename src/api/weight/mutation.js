import { useMutation } from "@tanstack/react-query";
import { fetchAddWeight, fetchDeleteWeight } from ".";

export const useAddWeight = () => {
  return useMutation({
    mutationKey: ["add-weight"],
    mutationFn: (body) => fetchAddWeight(body),
  });
};
// export const useUpdateUser = () => {
//   return useMutation({
//     mutationKey: ["update-user"],
//     mutationFn: (body) => fetchUpdateUser(body),
//   });
// };
export const useDeleteWeight = () => {
  return useMutation({
    mutationKey: ["delete-weight"],
    mutationFn: (body) => fetchDeleteWeight(body),
  });
};
