import { getSubjectReport } from "../../api/reports/subjectReportApi";

// FETCH SUBJECT REPORT
export const fetchSubjectReport = async (filters) => {
  try {
    const res = await getSubjectReport(filters);
    return res.data;
  } catch (error) {
    throw error;
  }
};


