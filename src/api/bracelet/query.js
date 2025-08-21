import { useQuery } from "@tanstack/react-query";
import { fetchBraceletList } from ".";

export const useBraceletList = (props) => {
  return useQuery({
    queryKey: ["bracelet-list", props],
    queryFn: () => fetchBraceletList(props),
  });
};
