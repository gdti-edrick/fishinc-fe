import { useQuery } from "@tanstack/react-query";
import { fetchMarketCode, fetchMarketSearchList } from ".";

export const useMarketCode = () => {
  return useQuery({
    queryKey: ["market-code"],
    queryFn: () => fetchMarketCode(),
  });
};

export const useMarketSearchList = (props) => {
  return useQuery({
    queryKey: ["market-search-list", props],
    queryFn: () => fetchMarketSearchList(props),
  });
};
