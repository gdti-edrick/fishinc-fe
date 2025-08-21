import { useQuery } from "@tanstack/react-query";
import { fetchEventList, fetchEventDetail } from ".";

export const useEventList = (props) => {
  return useQuery({
    queryKey: ["event-list", props],
    queryFn: () => fetchEventList(props),
  });
};

export const useEventDetail = (props) => {
  return useQuery({
    queryKey: ["event-detail", props],
    queryFn: () => fetchEventDetail(props),
  });
};
