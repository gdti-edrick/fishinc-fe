import { useQuery } from "@tanstack/react-query";
import { fetchLogList } from ".";

export const useLogList = (props) => {
  return useQuery({
    queryKey: ["log", props],
    queryFn: () => fetchLogList(props),
  });
};
