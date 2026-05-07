import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../api/questionApi";

export const fetchQuestions = async (params) => {
  const res = await getQuestions(params);
  return res.data;
};

export const createQuestion = async (data) => {
  const res = await addQuestion(data);
  return res.data;
};

export const editQuestion = async (data) => {
  const res = await updateQuestion(data);
  return res.data;
};

export const removeQuestion = async (id) => {
  const res = await deleteQuestion(id);
  return res.data;
};