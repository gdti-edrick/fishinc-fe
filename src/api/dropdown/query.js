import { useQuery } from "@tanstack/react-query";
import {
  fetchDropdownAdminRole,
  fetchDropdownGameCode,
  fetchDropdownPromoName,
  fetchDropdownPromoSource,
  fetchDropdownVendor,
  fetchNameFromPhone,
} from ".";

export const useNameFromPhone = (props) => {
  return useQuery({
    queryKey: ["dropdown-name-phone", props],
    queryFn: () => fetchNameFromPhone(props),
  });
};

export const useDropdownVendor = (props) => {
  return useQuery({
    queryKey: ["dropdown-vendor", props],
    queryFn: () => fetchDropdownVendor(props),
  });
};

export const useDropdownAdminRole = (props) => {
  return useQuery({
    queryKey: ["dropdown-admin-role", props],
    queryFn: () => fetchDropdownAdminRole(props),
  });
};

export const useDropdownGameCode = (props) => {
  return useQuery({
    queryKey: ["dropdown-game-code", props],
    queryFn: () => fetchDropdownGameCode(props),
  });
};

export const useDropdownPromoName = (props) => {
  return useQuery({
    queryKey: ["dropdown-promo-name", props],
    queryFn: () => fetchDropdownPromoName(props),
  });
};

export const useDropdownPromoSource = (props) => {
  return useQuery({
    queryKey: ["dropdown-promo-source", props],
    queryFn: () => fetchDropdownPromoSource(props),
  });
};
