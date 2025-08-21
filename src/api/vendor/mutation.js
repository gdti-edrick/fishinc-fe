import { useMutation } from "@tanstack/react-query";
import { fetchAddVendor, fetchDeleteVendor, fetchUpdateVendor } from ".";

export const useAddVendor = () => {
  return useMutation({
    mutationKey: ["add-vendor"],
    mutationFn: (body) => fetchAddVendor(body),
  });
};
export const useUpdateVendor = () => {
  return useMutation({
    mutationKey: ["update-vendor"],
    mutationFn: (body) => fetchUpdateVendor(body),
  });
};
export const useDeleteVendor = () => {
  return useMutation({
    mutationKey: ["delete-vendor"],
    mutationFn: (body) => fetchDeleteVendor(body),
  });
};
