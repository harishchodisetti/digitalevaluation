import {
  getRevaluationDetails,
  getRevaluationDetailById,
  createRevaluationDetail,
  deleteRevaluationDetail,
} from "../api/revaluationDetailApi";

// Fetch paged list
export const fetchDetails = async (query) => {
  const res = await getRevaluationDetails(query);
  return res.data;
};

// Fetch single detail
export const fetchDetailById = async (id) => {
  const res = await getRevaluationDetailById(id);
  return res.data;
};

// Create new detail
export const addDetail = async (dto) => {
  const res = await createRevaluationDetail(dto);
  return res.data;
};

// Delete detail
export const removeDetail = async (id) => {
  const res = await deleteRevaluationDetail(id);
  return res.data;
};
