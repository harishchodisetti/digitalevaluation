import API from "./axios";

// GET ALL
export const getActivityLogs = () =>
  API.get("/ActivityLog");

// GET PAGED
export const getPagedActivityLogs = (filters) =>
  API.post("/ActivityLog/paged", filters);

// CREATE
export const addActivityLog = (data) =>
  API.post("/ActivityLog", data);