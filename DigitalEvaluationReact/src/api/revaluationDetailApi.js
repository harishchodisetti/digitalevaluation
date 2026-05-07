import axios from "./axios";

const API_BASE = "/RevaluationDetails";

// GET all with query params (pagination + filters)
export const getRevaluationDetails = (params) =>
  axios.get(API_BASE, { params });

// GET by id
export const getRevaluationDetailById = (id) =>
  axios.get(`${API_BASE}/${id}`);

// POST create
export const createRevaluationDetail = (data) =>
  axios.post(API_BASE, data);

// DELETE by id
export const deleteRevaluationDetail = (id) =>
  axios.delete(`${API_BASE}/${id}`);