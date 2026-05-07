import API from "../api/axios";

// ✅ Get all assignments (paged result)
export const fetchRevaluationAssignments = async (query = {}) => {
  const res = await API.get("/RevaluationAssignments", { params: query });
  return res.data;
};

// ✅ Create new assignment
export const createRevaluationAssignment = async (data) => {
  const res = await API.post("/RevaluationAssignments", data);
  return res.data;
};

// ✅ Update assignment status
export const updateAssignmentStatus = async (data) => {
  const res = await API.put("/RevaluationAssignments/status", data);
  return res.data;
};

// ✅ Delete assignment
export const removeRevaluationAssignment = async (id) => {
  const res = await API.delete(`/RevaluationAssignments/${id}`);
  return res.data;
};
