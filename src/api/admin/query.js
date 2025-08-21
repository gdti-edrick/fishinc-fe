import { useQuery } from "@tanstack/react-query";
import { fetchAdminCrudList, fetchAdminList, fetchAdminRoleList } from ".";

export const useAdminList = (props) => {
  return useQuery({
    queryKey: ["admin-list", props],
    queryFn: () => fetchAdminList(props),
  });
};

export const useAdminCrudList = (props) => {
  return useQuery({
    queryKey: ["admin-crud-list", props],
    queryFn: () => fetchAdminCrudList(props),
  });
};

export const useAdminRoleList = (props) => {
  return useQuery({
    queryKey: ["admin-role-list", props],
    queryFn: () => fetchAdminRoleList(props),
  });
};
