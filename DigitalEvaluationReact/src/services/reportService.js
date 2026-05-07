import {
  getStudentReport,
  exportStudentExcel,
  exportStudentPdf
} from "../api/reports/reportApi";

// GET REPORT
export const fetchStudentReport = async (filters) => {
  const res = await getStudentReport(filters);
  return res.data;
};

// EXPORT EXCEL
export const downloadExcel = async (filters) => {
  const res = await exportStudentExcel(filters);

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "StudentReport.xlsx");
  document.body.appendChild(link);
  link.click();
};

// EXPORT PDF
export const downloadPdf = async (filters) => {
  const res = await exportStudentPdf(filters);

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "StudentReport.pdf");
  document.body.appendChild(link);
  link.click();
};



