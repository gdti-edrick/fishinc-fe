import { useMutation } from "@tanstack/react-query";
import { fetchAddPoint } from ".";

export const useAddPoint = () => {
  return useMutation({
    mutationKey: ["add-point"],
    mutationFn: (body) => fetchAddPoint(body),
  });
};
// export const useUpdateUser = () => {
//   return useMutation({
//     mutationKey: ["update-user"],
//     mutationFn: (body) => fetchUpdateUser(body),
//   });
// };
// export const useDeleteUser = () => {
//   return useMutation({
//     mutationKey: ["delete-user"],
//     mutationFn: (body) => fetchDeleteUser(body),
//   });
// };
