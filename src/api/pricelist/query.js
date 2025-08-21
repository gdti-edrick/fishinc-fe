import { useQuery } from "@tanstack/react-query";
import { fetchPricelistList } from ".";

export const usePricelistList = (props) => {
  return useQuery({
    queryKey: ["pricelist-list", props],
    queryFn: () => fetchPricelistList(props),
  });
};
