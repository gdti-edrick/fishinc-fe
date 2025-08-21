import { useMutation } from "@tanstack/react-query";
import { fetchTransactionDetail } from ".";

// export const useBreceletCheck = () => {
//   return useMutation({
//     mutationKey: ["brecelet", "brecelet-checked"],
//     mutationFn: (body) => fetchBreceletCheck(body),
//   });
// };

export const useTransactionDetailPrint = () => {
  return useMutation({
    mutationKey: ["transaction", "print-detail"],
    mutationFn: (body) => fetchTransactionDetail(body),
  });
};
