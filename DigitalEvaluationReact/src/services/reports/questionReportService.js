import { getQuestionReport } from "../../api/reports/questionReportApi";

export const fetchQuestionReport = async (filters) => {
  const res = await getQuestionReport(filters);
  return res.data;
};