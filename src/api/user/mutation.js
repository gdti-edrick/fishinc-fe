import { useMutation } from "@tanstack/react-query";
import { fetchAddUser, fetchDeleteUser, fetchUpdateUser } from ".";

export const useAddUser = () => {
  return useMutation({
    mutationKey: ["add-user"],
    mutationFn: (body) => fetchAddUser(body),
  });
};
export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ["update-user"],
    mutationFn: (body) => fetchUpdateUser(body),
  });
};
export const useDeleteUser = () => {
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (body) => fetchDeleteUser(body),
  });
};
