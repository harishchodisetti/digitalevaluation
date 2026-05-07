import {
  getRevaluationMarks,
  getRevaluationMarkById,
  createRevaluationMark,
  updateRevaluationMark,
  deleteRevaluationMark,
} from "../api/revaluationMarkApi";

// Fetch paged list
export const fetchMarks = async (query) => {
  const res = await getRevaluationMarks(query);
  return res.data;
};

// Fetch single mark
export const fetchMarkById = async (id) => {
  const res = await getRevaluationMarkById(id);
  return res.data;
};

// Create new mark
export const addMark = async (dto) => {
  const res = await createRevaluationMark(dto);
  return res.data;
};

// Update mark
export const editMark = async (dto) => {
  const res = await updateRevaluationMark(dto);
  return res.data;
};

// Delete mark
export const removeMark = async (id) => {
  const res = await deleteRevaluationMark(id);
  return res.data;
};
