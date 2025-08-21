import { useMutation } from "@tanstack/react-query";
import { fetchForceStop } from ".";

export const useForceStop = () => {
  return useMutation({
    mutationKey: ["force-stop"],
    mutationFn: (body) => fetchForceStop(body),
  });
};
