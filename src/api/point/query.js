import { useQuery } from "@tanstack/react-query";
import { fetchPointDetail, fetchPointList } from ".";

export const usePointList = (props) => {
  return useQuery({
    queryKey: ["point-list", props],
    queryFn: () => fetchPointList(props),
  });
};

export const usePointDetail = (props) => {
  return useQuery({
    queryKey: ["point-detail", props],
    queryFn: () => fetchPointDetail(props),
    // enabled: !!props.userphone,
  });
};
