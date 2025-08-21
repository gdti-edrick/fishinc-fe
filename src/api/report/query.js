import { useQuery } from "@tanstack/react-query";
import {
  fetchReportIncomeList,
  fetchReportIncomePointList,
  fetchReportList,
  fetchReportPnlList,
  fetchReportPointList,
  fetchReportPurchasingList,
  fetchReportPurchasingVendor,
} from ".";

export const useReportList = (props) => {
  return useQuery({
    queryKey: ["report-list", props],
    queryFn: () => fetchReportList(props),
  });
};

export const useReportPurchasingList = (props) => {
  return useQuery({
    queryKey: ["report-purchasing-list", props],
    queryFn: () => fetchReportPurchasingList(props),
  });
};

export const useReportIncomeList = (props) => {
  return useQuery({
    queryKey: ["report-income-list", props],
    queryFn: () => fetchReportIncomeList(props),
  });
};

export const useReportPointList = (props) => {
  return useQuery({
    queryKey: ["report-point-list", props],
    queryFn: () => fetchReportPointList(props),
  });
};

export const useReportIncomePointList = (props) => {
  return useQuery({
    queryKey: ["report-income-point-list", props],
    queryFn: () => fetchReportIncomePointList(props),
  });
};

export const useReportPnlList = (props) => {
  return useQuery({
    queryKey: ["report-pnl-list", props],
    queryFn: () => fetchReportPnlList(props),
  });
};

export const useReportPurchasingVendor = (props) => {
  return useQuery({
    queryKey: ["report-purchasing-vendor", props],
    queryFn: () => fetchReportPurchasingVendor(props),
  });
};
