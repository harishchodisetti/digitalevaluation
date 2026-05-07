import API from "../axios";

// POST /api/reports/evaluation
export const getEvaluationReport = (data) => {
  return API.post("/reports/evaluation", data);
};