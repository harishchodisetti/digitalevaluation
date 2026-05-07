import API from "./axios";

// GET all with pagination + optional status filter
export const getAssignments = (page = 1, pageSize = 10, status = null) =>
  API.get("/StudentExamAssignments", {
    params: { page, pageSize, status }
  });

// GET by ID
export const getAssignmentById = (id) =>
  API.get(`/StudentExamAssignments/${id}`);

// CREATE (expects StudentExamAssignmentCreateDto)
export const createAssignment = (data) =>
  API.post("/StudentExamAssignments", data);

// UPDATE (expects StudentExamAssignmentUpdateDto)
export const updateAssignment = (data) =>
  API.put("/StudentExamAssignments", {
    studentExamAssignmentId: data.studentExamAssignmentId,
    status: data.status,
    startTime: data.startTime || null,
    endTime: data.endTime || null
  });

// DELETE
export const deleteAssignment = (id) =>
  API.delete(`/StudentExamAssignments/${id}`);
