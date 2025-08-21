import { useMutation } from "@tanstack/react-query";
import {
  fetchAddEvent,
  fetchAddEventDetail,
  fetchDeleteEvent,
  fetchDeleteEventDetail,
  fetchUpdateEvent,
  fetchUpdateEventDetail,
} from ".";

export const useAddEvent = () => {
  return useMutation({
    mutationKey: ["add-event"],
    mutationFn: (body) => fetchAddEvent(body),
  });
};

export const useUpdateEvent = () => {
  return useMutation({
    mutationKey: ["update-event"],
    mutationFn: (body) => fetchUpdateEvent(body),
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationKey: ["delete-event"],
    mutationFn: (body) => fetchDeleteEvent(body),
  });
};

export const useAddEventDetail = () => {
  return useMutation({
    mutationKey: ["add-event-detail"],
    mutationFn: (body) => fetchAddEventDetail(body),
  });
};

export const useUpdateEventDetail = () => {
  return useMutation({
    mutationKey: ["update-event-detail"],
    mutationFn: (body) => fetchUpdateEventDetail(body),
  });
};

export const useDeleteEventDetail = () => {
  return useMutation({
    mutationKey: ["delete-event-detail"],
    mutationFn: (body) => fetchDeleteEventDetail(body),
  });
};
