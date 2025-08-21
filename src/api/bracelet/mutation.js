import { useMutation } from "@tanstack/react-query";
import { fetchBreceletAdd, fetchBreceletCheck, fetchBreceletCheckout } from ".";

export const useBreceletCheck = () => {
  return useMutation({
    mutationKey: ["brecelet", "brecelet-checked"],
    mutationFn: (body) => fetchBreceletCheck(body),
  });
};

export const useBreceletCheckout = () => {
  return useMutation({
    mutationKey: ["brecelet", "brecelet-checkout"],
    mutationFn: (body) => fetchBreceletCheckout(body),
  });
};

export const useBreceletAdd = () => {
  return useMutation({
    mutationKey: ["brecelet", "add"],
    mutationFn: (body) => fetchBreceletAdd(body),
  });
};
