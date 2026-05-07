import API from "./axios";

// GET
export const getOptions = (params) =>
  API.get("/QuestionOptions", { params });

// CREATE
export const addOption = (data) =>
  API.post("/QuestionOptions", data);

// UPDATE
export const updateOption = (data) =>
  API.put("/QuestionOptions", data);

// DELETE
export const deleteOption = (id) =>
  API.delete(`/QuestionOptions/${id}`);