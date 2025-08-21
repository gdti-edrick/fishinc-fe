import { useMutation } from "@tanstack/react-query";
import {
  fetchBookingBraceletCheck,
  fetchBookingCreate,
  fetchBookingExtend,
  fetchBookingNoteAdd,
  fetchBookingRebind,
  fetchBookingUnbind,
} from ".";

export const useBookingCreate = () => {
  return useMutation({
    mutationKey: ["booking-create"],
    mutationFn: (body) => fetchBookingCreate(body),
  });
};

export const useBookingExtend = () => {
  return useMutation({
    mutationKey: ["booking-extend"],
    mutationFn: (body) => fetchBookingExtend(body),
  });
};

export const useBookingUnbind = () => {
  return useMutation({
    mutationKey: ["booking-unbind"],
    mutationFn: (body) => fetchBookingUnbind(body),
  });
};

export const useBookingRebind = () => {
  return useMutation({
    mutationKey: ["booking-rebind"],
    mutationFn: (body) => fetchBookingRebind(body),
  });
};
export const useBookingBraceletCheck = () => {
  return useMutation({
    mutationKey: ["booking-bracelet-check"],
    mutationFn: (body) => fetchBookingBraceletCheck(body),
  });
};

export const useBookingNoteAdd = () => {
  return useMutation({
    mutationKey: ["booking-note-add"],
    mutationFn: (body) => fetchBookingNoteAdd(body),
  });
};
