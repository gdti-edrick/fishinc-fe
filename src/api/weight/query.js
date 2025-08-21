import { useQuery } from "@tanstack/react-query";
import { fetchWeightList } from ".";

export const useWeightList = (props) => {
  return useQuery({
    queryKey: ["weight-list", props],
    queryFn: () => fetchWeightList(props),
  });
};
