import { getRevaluationReport } from "../../api/reports/revaluationReportApi";

// FETCH REVALUATION REPORT
export const fetchRevaluationReport = async (filters) => {
  const res = await getRevaluationReport(filters);
  return res.data; // IMPORTANT
};