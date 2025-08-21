import { useQuery } from "@tanstack/react-query";
import { fetchHolidayList } from ".";

export const useHolidayList = (props) => {
  return useQuery({
    queryKey: ["holiday-list", props],
    queryFn: () => fetchHolidayList(props),
  });
};
