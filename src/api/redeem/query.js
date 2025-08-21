import { useQuery } from "@tanstack/react-query";
import { fetchRedeemCode, fetchRedeemSearchList } from ".";

export const useRedeemCode = () => {
  return useQuery({
    queryKey: ["redeem-code"],
    queryFn: () => fetchRedeemCode(),
  });
};

export const useRedeemSearchList = (props) => {
  return useQuery({
    queryKey: ["redeem-search-list", props],
    queryFn: () => fetchRedeemSearchList(props),
  });
};
