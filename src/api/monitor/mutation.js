import { useMutation } from "@tanstack/react-query";
import { fetchMonitorPhone } from ".";

export const useMonitorPhone = () => {
  return useMutation({
    mutationKey: ["monitor-phone"],
    mutationFn: (body) => fetchMonitorPhone(body),
  });
};
