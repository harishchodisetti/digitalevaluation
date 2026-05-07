import API from "./axios";

// GET ALL
export const getEvaluations = () => API.get("/Evaluations");

// GET BY ID
export const getEvaluationById = (id) =>
  API.get(`/Evaluations/${id}`);

// CREATE
export const addEvaluation = (data) =>
  API.post("/Evaluations", data);

// UPDATE
export const editEvaluation = (data) =>
  API.put("/Evaluations", data);

// DELETE
export const deleteEvaluation = (id) =>
  API.delete(`/Evaluations/${id}`);