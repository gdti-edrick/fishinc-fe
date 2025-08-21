import { useQuery } from "@tanstack/react-query";
import {
  fetchMonitorBigSmall,
  fetchMonitorDwma,
  fetchMonitorInfo,
  fetchMonitorPoint,
  fetchMonitorWeight,
} from ".";

export const useMonitorDwma = () => {
  return useQuery({
    queryKey: ["monitor-dwma"],
    queryFn: () => fetchMonitorDwma(),
  });
};

export const useMonitorInfo = () => {
  return useQuery({
    queryKey: ["monitor-info"],
    queryFn: () => fetchMonitorInfo(),
  });
};

export const useMonitorBigSmall = () => {
  return useQuery({
    queryKey: ["monitor-big-small"],
    queryFn: () => fetchMonitorBigSmall(),
  });
};

// export const useMonitorPhone = (props) => {
//   return useQuery({
//     queryKey: ["monitor-phone", props],
//     queryFn: () => fetchMonitorPhone(props),
//   });
// };

export const useMonitorPoint = (props) => {
  return useQuery({
    queryKey: ["monitor-point", props],
    queryFn: () => fetchMonitorPoint(props),
  });
};

export const useMonitorWeight = (props) => {
  return useQuery({
    queryKey: ["monitor-weight", props],
    queryFn: () => fetchMonitorWeight(props),
  });
};
