import { useMutation } from "@tanstack/react-query";
import { fetchUpdatePricelist } from ".";

export const useUpdatePricelist = () => {
  return useMutation({
    mutationKey: ["update-pricelist"],
    mutationFn: (body) => fetchUpdatePricelist(body),
  });
};
