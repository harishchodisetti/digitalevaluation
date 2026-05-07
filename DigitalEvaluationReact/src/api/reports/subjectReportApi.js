import API from "../axios";

// SUBJECT REPORT API
export const getSubjectReport = (data) => {
  return API.post("/reports/subject", data);
};