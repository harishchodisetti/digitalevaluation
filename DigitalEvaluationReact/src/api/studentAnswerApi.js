import API from "./axios";

// GET (with filters)
export const getStudentAnswers = (params) =>
  API.get("/StudentAnswers", { params });

// CREATE
export const addStudentAnswer = (data) =>
  API.post("/StudentAnswers", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// UPDATE
export const updateStudentAnswer = (data) =>
  API.put("/StudentAnswers", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

// EVALUATE
export const evaluateAnswer = (data) =>
  API.put("/StudentAnswers/evaluate", data);

// DELETE
export const deleteStudentAnswer = (id) =>
  API.delete(`/StudentAnswers/${id}`);