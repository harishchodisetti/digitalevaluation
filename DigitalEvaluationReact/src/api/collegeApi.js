import API from "./axios";

// GET
export const getColleges = () =>
  API.get("/Colleges");

// CREATE
export const addCollege = (data) =>
  API.post("/Colleges", data);

// UPDATE
export const editCollege = (id, data) =>
  API.put(`/Colleges/${id}`, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });

// DELETE
export const deleteCollege = (id) =>
  API.delete(`/Colleges/${id}`);