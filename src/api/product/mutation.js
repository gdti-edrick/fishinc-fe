import { useMutation } from "@tanstack/react-query";
import {
  fetchAddProduct,
  fetchAddProductStock,
  fetchDeleteProduct,
  fetchUpdateProduct,
} from ".";

export const useAddProduct = () => {
  return useMutation({
    mutationKey: ["add-product"],
    mutationFn: (body) => fetchAddProduct(body),
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationKey: ["update-product"],
    mutationFn: (body) => fetchUpdateProduct(body),
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationKey: ["delete-product"],
    mutationFn: (body) => fetchDeleteProduct(body),
  });
};

export const useAddProductStock = () => {
  return useMutation({
    mutationKey: ["add-product-stock"],
    mutationFn: (body) => fetchAddProductStock(body),
  });
};

// export const useUpdateEventDetail = () => {
//   return useMutation({
//     mutationKey: ["update-event-detail"],
//     mutationFn: (body) => fetchUpdateEventDetail(body),
//   });
// };

// export const useDeleteEventDetail = () => {
//   return useMutation({
//     mutationKey: ["delete-event-detail"],
//     mutationFn: (body) => fetchDeleteEventDetail(body),
//   });
// };
