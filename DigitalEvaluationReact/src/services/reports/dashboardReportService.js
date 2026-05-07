import { getDashboardReport } from "../../api/reports/dashboardReportApi";

export const fetchDashboardReport = async (filters) => {
  const res = await getDashboardReport(filters);
  return res.data; // object (DashboardDto)
};