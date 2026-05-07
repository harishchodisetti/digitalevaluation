import API from "./axios";

// GET (with query params)
export const getQuestions = (params) =>
  API.get("/Questions", { params });

// CREATE
export const addQuestion = (data) =>
  API.post("/Questions", data);

// UPDATE
export const updateQuestion = (data) =>
  API.put("/Questions", data);

// DELETE
export const deleteQuestion = (id) =>
  API.delete(`/Questions/${id}`);