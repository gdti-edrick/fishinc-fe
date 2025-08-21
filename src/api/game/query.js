import { useQuery } from "@tanstack/react-query";
import { fetchGameList } from ".";

export const useGameList = (props) => {
  return useQuery({
    queryKey: ["game-list", props],
    queryFn: () => fetchGameList(props),
  });
};
