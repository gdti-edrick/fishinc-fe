import { useQuery } from "@tanstack/react-query";
import { fetchEntityList } from ".";

export const useEntityList = (props) => {
  return useQuery({
    queryKey: ["entity-list", props],
    queryFn: () => fetchEntityList(props),
  });
};
