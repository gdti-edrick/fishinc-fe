import { useQuery } from "@tanstack/react-query";
import {
  fetchTransactionDetail,
  fetchTransactionListAll,
  fetchTransactionListIdr,
  fetchTransactionListPoint,
  fetchTransactionSummaryAll,
  fetchTransactionSummaryAllItem,
  fetchTransactionSummaryIdr,
  fetchTransactionSummaryIdrItem,
  fetchTransactionSummaryPoint,
  fetchTransactionSummaryPointItem,
} from ".";

export const useTransactionDetail = (props) => {
  return useQuery({
    queryKey: ["transaction-detail", props],
    queryFn: () => fetchTransactionDetail(props),
  });
};

export const useTransactionListAll = (props) => {
  return useQuery({
    queryKey: ["transaction-list-all", props],
    queryFn: () => fetchTransactionListAll(props),
  });
};
export const useTransactionSummaryAll = (props) => {
  return useQuery({
    queryKey: ["transaction-summary-all", props],
    queryFn: () => fetchTransactionSummaryAll(props),
  });
};
export const useTransactionSummaryAllItem = (props) => {
  return useQuery({
    queryKey: ["transaction-item-summary-all", props],
    queryFn: () => fetchTransactionSummaryAllItem(props),
  });
};

export const useTransactionListIdr = (props) => {
  return useQuery({
    queryKey: ["transaction-list-idr", props],
    queryFn: () => fetchTransactionListIdr(props),
  });
};
export const useTransactionSummaryIdr = (props) => {
  return useQuery({
    queryKey: ["transaction-summary-idr", props],
    queryFn: () => fetchTransactionSummaryIdr(props),
  });
};
export const useTransactionSummaryIdrItem = (props) => {
  return useQuery({
    queryKey: ["transaction-item-summary-idr", props],
    queryFn: () => fetchTransactionSummaryIdrItem(props),
  });
};

export const useTransactionListPoint = (props) => {
  return useQuery({
    queryKey: ["transaction-list-point", props],
    queryFn: () => fetchTransactionListPoint(props),
  });
};
export const useTransactionSummaryPoint = (props) => {
  return useQuery({
    queryKey: ["transaction-summary-point", props],
    queryFn: () => fetchTransactionSummaryPoint(props),
  });
};
export const useTransactionSummaryPointItem = (props) => {
  return useQuery({
    queryKey: ["transaction-item-summary-point", props],
    queryFn: () => fetchTransactionSummaryPointItem(props),
  });
};
