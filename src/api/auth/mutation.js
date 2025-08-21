import { useMutation } from "@tanstack/react-query";
import {
  fetchFirstSignin,
  fetchForgotPassword,
  fetchNewPassword,
  fetchSignin,
  fetchSignup,
} from ".";

export const useSignIn = () => {
  return useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: (body) => fetchSignin(body),
  });
};

export const useFirstSignIn = () => {
  return useMutation({
    mutationKey: ["auth", "first-sign-in"],
    mutationFn: (body) => fetchFirstSignin(body),
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: (body) => fetchSignup(body),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: (body) => fetchForgotPassword(body),
  });
};

export const useNewPassword = () => {
  return useMutation({
    mutationKey: ["auth", "new-password"],
    mutationFn: (body) => fetchNewPassword(body),
  });
};
