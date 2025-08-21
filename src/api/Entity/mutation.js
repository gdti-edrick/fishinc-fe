import { useMutation } from "@tanstack/react-query";
import { fetchAddEntity, fetchDeleteEntity, fetchUpdateEntity } from ".";

export const useAddEntity = () => {
  return useMutation({
    mutationKey: ["entity-user"],
    mutationFn: (body) => fetchAddEntity(body),
  });
};
export const useUpdateEntity = () => {
  return useMutation({
    mutationKey: ["update-entity"],
    mutationFn: (body) => fetchUpdateEntity(body),
  });
};
export const useDeleteEntity = () => {
  return useMutation({
    mutationKey: ["delete-entity"],
    mutationFn: (body) => fetchDeleteEntity(body),
  });
};
