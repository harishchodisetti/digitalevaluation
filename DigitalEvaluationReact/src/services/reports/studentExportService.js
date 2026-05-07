


import {
  exportStudentExcel,
  exportStudentPdf,
} from "../../api/reports/studentExportApi";

// 📥 EXCEL
export const downloadExcel = async (filters) => {
  const res = await exportStudentExcel(filters);
  return res.data;
};

// 📥 PDF
export const downloadPdf = async (filters) => {
  const res = await exportStudentPdf(filters);
  return res.data;
};