import { useQuery } from "@tanstack/react-query";
import { fetchSeatList } from ".";

export const useSeatList = (props) => {
  return useQuery({
    queryKey: ["seat-list", props],
    queryFn: () => fetchSeatList(props),
  });
};
