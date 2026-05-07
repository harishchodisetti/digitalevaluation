import { getEvaluationReport } from "../../api/reports/evaluationReportApi";

export const fetchEvaluationReport = async (filters) => {
  const res = await getEvaluationReport(filters);
  return res.data;
};