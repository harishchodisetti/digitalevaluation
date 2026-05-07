import {

  getAuditLogs,
  getPagedAuditLogs,
  createAuditLog

} from "../api/AuditLogApi";

// GET ALL

export const fetchAuditLogs = async () => {

  const res = await getAuditLogs();

  return res.data;
};

// PAGED

export const fetchPagedAuditLogs = async (data) => {

  const res = await getPagedAuditLogs(data);

  return res.data;
};

// CREATE

export const addAuditLog = async (data) => {

  const res = await createAuditLog(data);

  return res.data;
};