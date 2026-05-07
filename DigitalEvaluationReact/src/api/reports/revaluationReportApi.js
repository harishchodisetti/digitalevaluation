import API from "../axios";

// POST /reports/revaluation
export const getRevaluationReport = (data) => {
  return API.post("/reports/revaluation", data);
};