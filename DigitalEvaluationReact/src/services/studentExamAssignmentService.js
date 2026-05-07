import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from "../api/studentExamAssignmentApi";

// GET ALL
export const fetchAssignments = async (page = 1, pageSize = 10, status = null) => {
  const res = await getAssignments(page, pageSize, status);
  return res.data;
};

// GET BY ID
export const fetchAssignmentById = async (id) => {
  const res = await getAssignmentById(id);
  return res.data;
};

// CREATE
export const addAssignment = async (data) => {
  const res = await createAssignment(data);
  return res.data;
};

// UPDATE
export const editAssignment = async (data) => {
  const res = await updateAssignment(data);
  return res.data;
};

// DELETE
export const removeAssignment = async (id) => {
  const res = await deleteAssignment(id);
  return res.data;
};
