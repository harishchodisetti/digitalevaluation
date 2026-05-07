import API from "../axios";

// STUDENT REPORT
export const getStudentReport = (data) =>
  API.post("/reports/student", data);

// EXPORT EXCEL
export const exportStudentExcel = (data) =>
  API.post("/reports/student/export/excel", data, {
    responseType: "blob"
  });

// EXPORT PDF
export const exportStudentPdf = (data) =>
  API.post("/reports/student/export/pdf", data, {
    responseType: "blob"
  });




