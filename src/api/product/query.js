import { useQuery } from "@tanstack/react-query";
import { fetchProductList, fetchProductStock, fetchStock } from ".";

export const useProductList = (props) => {
  return useQuery({
    queryKey: ["product-list", props],
    queryFn: () => fetchProductList(props),
  });
};

export const useProductStock = (props) => {
  return useQuery({
    queryKey: ["product-stock", props],
    queryFn: () => fetchProductStock(props),
  });
};

export const useStock = (props) => {
  return useQuery({
    queryKey: ["stock", props],
    queryFn: () => fetchStock(props),
  });
};
