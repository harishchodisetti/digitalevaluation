import API from "../axios";

// 📊 EXCEL
export const exportStudentExcel = (filters) => {
  return API.post("/reports/student/export/excel", filters, {
    responseType: "blob",
  });
};

// 📄 PDF
export const exportStudentPdf = (filters) => {
  return API.post("/reports/student/export/pdf", filters, {
    responseType: "blob",
  });
};