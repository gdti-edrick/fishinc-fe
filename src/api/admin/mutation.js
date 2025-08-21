import { useMutation } from "@tanstack/react-query";
import {
  fetchAddAdmin,
  fetchAddAdminRole,
  fetchAdminUnsuspendNewPass,
  fetchDeleteAdmin,
  fetchDeleteAdminRole,
  fetchUpdateAdmin,
  fetchUpdateAdminCrud,
  fetchUpdateAdminRole,
} from ".";

export const useAddAdmin = () => {
  return useMutation({
    mutationKey: ["admin", "add"],
    mutationFn: (body) => fetchAddAdmin(body),
  });
};
export const useUpdateAdmin = () => {
  return useMutation({
    mutationKey: ["admin", "update"],
    mutationFn: (body) => fetchUpdateAdmin(body),
  });
};
export const useDeleteAdmin = () => {
  return useMutation({
    mutationKey: ["admin", "add"],
    mutationFn: (body) => fetchDeleteAdmin(body),
  });
};

export const useUpdateAdminCrud = () => {
  return useMutation({
    mutationKey: ["admin-crud", "update"],
    mutationFn: (body) => fetchUpdateAdminCrud(body),
  });
};

export const useAddAdminRole = () => {
  return useMutation({
    mutationKey: ["admin-role", "add"],
    mutationFn: (body) => fetchAddAdminRole(body),
  });
};
export const useUpdateAdminRole = () => {
  return useMutation({
    mutationKey: ["admin-role", "update"],
    mutationFn: (body) => fetchUpdateAdminRole(body),
  });
};

export const useDeleteAdminRole = () => {
  return useMutation({
    mutationKey: ["admin-role", "delete"],
    mutationFn: (body) => fetchDeleteAdminRole(body),
  });
};

export const useAdminUnsuspendNewPass = () => {
  return useMutation({
    mutationKey: ["admin-unsuspend", "new-password"],
    mutationFn: (body) => fetchAdminUnsuspendNewPass(body),
  });
};
