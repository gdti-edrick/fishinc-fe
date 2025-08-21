import { useQuery } from "@tanstack/react-query";
import { fetchVendorList } from ".";

export const useVendorList = (props) => {
  return useQuery({
    queryKey: ["vendor-list", props],
    queryFn: () => fetchVendorList(props),
  });
};
