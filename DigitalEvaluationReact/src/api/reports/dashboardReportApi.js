import API from "../axios";

// POST /reports/dashboard
export const getDashboardReport = (filters) => {
  return API.post("/reports/dashboard", filters);
};