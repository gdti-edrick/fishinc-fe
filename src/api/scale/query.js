import { useQuery } from "@tanstack/react-query";
import { fetchScaleList } from ".";

export const useScaleList = (props) => {
  return useQuery({
    queryKey: ["scale-list", props],
    queryFn: () => fetchScaleList(props),
  });
};
