import API from "../api/axios";

// ✅ Get all revaluation requests
export const fetchRevaluationRequests = async () => {
  const res = await API.get("/RevaluationRequests");
  return res.data;
};

// ✅ Create a new revaluation request
export const createRevaluationRequest = async (data) => {
  const res = await API.post("/RevaluationRequests", data);
  return res.data;
};

// ✅ Update status of a revaluation request
export const updateRevaluationStatus = async (data) => {
  // data should include: revaluationRequestId, status, remarks, approvedBy
  const res = await API.put("/RevaluationRequests/status", data);
  return res.data;
};

// ✅ Delete a revaluation request
export const removeRevaluationRequest = async (id) => {
  const res = await API.delete(`/RevaluationRequests/${id}`);
  return res.data;
};
