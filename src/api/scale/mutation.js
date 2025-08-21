import { useMutation } from "@tanstack/react-query";
import { fetchAddScale } from ".";

export const useAddScale = () => {
  return useMutation({
    mutationKey: ["scale-add"],
    mutationFn: (body) => fetchAddScale(body),
  });
};
