import {
  getEvaluations,
  addEvaluation,
  editEvaluation,
  deleteEvaluation
} from "../api/evaluationApi";

// FETCH
export const fetchEvaluations = async () => {
  const res = await getEvaluations();
  return res.data;
};

// CREATE
export const createEvaluation = async (data) => {
  const res = await addEvaluation(data);
  return res.data;
};

// UPDATE
export const updateEvaluation = async (data) => {
  const res = await editEvaluation(data);
  return res.data;
};

// DELETE
export const removeEvaluation = async (id) => {
  const res = await deleteEvaluation(id);
  return res.data;
};