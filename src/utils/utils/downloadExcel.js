import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

export const downloadExcel = (data, filename) => {
  if (!data) return;
  const wsData = [["No", ...Object.keys(data[0])]];

  data.forEach((item, index) => {
    wsData.push([`${index + 1}`, ...Object.values(item)]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");

  const fileName = `${filename}_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);
};
