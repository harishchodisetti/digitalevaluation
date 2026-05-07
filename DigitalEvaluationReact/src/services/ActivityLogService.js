import {
  getActivityLogs,
  getPagedActivityLogs,
  addActivityLog
} from "../api/ActivityLogApi";

// GET ALL
export const fetchActivityLogs = async () => {
  const res = await getActivityLogs();
  return res.data;
};

// GET PAGED
export const fetchPagedLogs = async (filters) => {
  const res = await getPagedActivityLogs(filters);
  return res.data;
};

// CREATE
export const createActivityLog = async (data) => {
  const res = await addActivityLog(data);
  return res.data;
};