import API from "./axios";

// GET ALL (with params)
export const getExamSections = (params) =>
  API.get("/ExamSections", { params });

// GET BY ID
export const getExamSectionById = (id) =>
  API.get(`/ExamSections/${id}`);

// CREATE
export const addExamSection = (data) =>
  API.post("/ExamSections", data);

// UPDATE
export const editExamSection = (data) =>
  API.put("/ExamSections", data);

// DELETE
export const deleteExamSection = (id) =>
  API.delete(`/ExamSections/${id}`);