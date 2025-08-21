import { useQuery } from "@tanstack/react-query";
import {
  fetchBookingHomeList,
  fetchBookingList,
  fetchBookingNote,
  fetchCalculateprice,
  fetchReportSummary,
} from ".";

export const useBookingList = (props) => {
  return useQuery({
    queryKey: ["booking-list", props],
    queryFn: () => fetchBookingList(props),
  });
};

export const useBookingReportSummary = (props) => {
  return useQuery({
    queryKey: ["booking-report-summary", props],
    queryFn: () => fetchReportSummary(props),
  });
};

export const useBookingHomeList = () => {
  return useQuery({
    queryKey: ["booking-home-list"],
    queryFn: () => fetchBookingHomeList(),
  });
};

export const useCalculateprice = (props) => {
  return useQuery({
    queryKey: ["calculate-price", props],
    queryFn: () => fetchCalculateprice(props),
  });
};

export const useBookingNote = (props) => {
  return useQuery({
    queryKey: ["booking-note", props],
    queryFn: () => fetchBookingNote(props),
  });
};
