import { useQuery } from "@tanstack/react-query";
import { fetchPromoList } from ".";

export const usePromoList = (props) => {
  return useQuery({
    queryKey: ["promo-list", props],
    queryFn: () => fetchPromoList(props),
  });
};
