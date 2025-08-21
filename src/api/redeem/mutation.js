import { useMutation } from "@tanstack/react-query";
import { fetchRedeemAdd, fetchRedeemSearch, fetchSendOtp } from ".";

export const useRedeemSearch = () => {
  return useMutation({
    mutationKey: ["redeem-search"],
    mutationFn: (body) => fetchRedeemSearch(body),
  });
};
export const useRedeemAdd = () => {
  return useMutation({
    mutationKey: ["redeem-add"],
    mutationFn: (body) => fetchRedeemAdd(body),
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationKey: ["send-otp"],
    mutationFn: (body) => fetchSendOtp(body),
  });
};
