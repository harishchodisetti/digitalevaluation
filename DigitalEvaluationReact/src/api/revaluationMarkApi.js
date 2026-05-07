import axios from "./axios";

const API_BASE = "/RevaluationMarks"; // adjust port

// GET all with filters (pagination, detailId)
export const getRevaluationMarks = (params) =>
  axios.get(API_BASE, { params });

// GET by id
export const getRevaluationMarkById = (id) =>
  axios.get(`${API_BASE}/${id}`);

// POST create
export const createRevaluationMark = (data) =>
  axios.post(API_BASE, data);

// PUT update
export const updateRevaluationMark = (data) =>
  axios.put(API_BASE, data);

// DELETE by id
export const deleteRevaluationMark = (id) =>
  axios.delete(`${API_BASE}/${id}`);
