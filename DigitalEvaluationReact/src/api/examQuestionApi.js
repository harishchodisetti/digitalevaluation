import API from "./axios";

// GET ALL
export const getExamQuestions = (params) =>
  API.get("/ExamQuestions", { params });

// CREATE
export const addExamQuestion = (data) =>
  API.post("/ExamQuestions", data);

// UPDATE
export const editExamQuestion = (data) =>
  API.put("/ExamQuestions", data);

// DELETE
export const deleteExamQuestion = (id) =>
  API.delete(`/ExamQuestions/${id}`);