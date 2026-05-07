import API from "./axios";

// GET ALL
export const getAuditLogs = () =>
  API.get("/AuditLog");

// PAGED
export const getPagedAuditLogs = (data) =>
  API.post("/AuditLog/paged", data);

// CREATE
export const createAuditLog = (data) =>
  API.post("/AuditLog", data);