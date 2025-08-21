import { useQuery } from "@tanstack/react-query";
import { fetchRefreshToken } from ".";

export const refreshToken = () => {
  return useQuery({
    queryKey: ["refresh-token"],
    queryFn: fetchRefreshToken,
  });
};
