import { useMutation } from "@tanstack/react-query";
import { fetchAddPromo, fetchDeletePromo } from ".";

export const useAddPromo = () => {
  return useMutation({
    mutationKey: ["add-promo"],
    mutationFn: (body) => fetchAddPromo(body),
  });
};
// export const useUpdatePromo = () => {
//   return useMutation({
//     mutationKey: ["update-promo"],
//     mutationFn: (body) => fetchUpdatePromo(body),
//   });
// };
export const useDeletePromo = () => {
  return useMutation({
    mutationKey: ["delete-promo"],
    mutationFn: (body) => fetchDeletePromo(body),
  });
};
