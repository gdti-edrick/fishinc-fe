import { useMutation } from "@tanstack/react-query";
import { fetchMarketAdd, fetchMarketSearch } from ".";

export const useMarketSearch = () => {
  return useMutation({
    mutationKey: ["market-search"],
    mutationFn: (body) => fetchMarketSearch(body),
  });
};
export const useMarketAdd = () => {
  return useMutation({
    mutationKey: ["market-add"],
    mutationFn: (body) => fetchMarketAdd(body),
  });
};

// export const useDeleteVendor = () => {
//   return useMutation({
//     mutationKey: ["delete-vendor"],
//     mutationFn: (body) => fetchDeleteVendor(body),
//   });
// };
