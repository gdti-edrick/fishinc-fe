import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from ".";

export const useUserList = (props) => {
  return useQuery({
    queryKey: ["user-list", props],
    queryFn: () => fetchUserList(props),
  });
};
