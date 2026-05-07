import {
  getExamQuestions,
  addExamQuestion,
  editExamQuestion,
  deleteExamQuestion
} from "../api/examQuestionApi";

export const fetchExamQuestions = async (params) => {
  const res = await getExamQuestions(params);
  return res.data;
};

export const createExamQuestion = async (data) => {
  const res = await addExamQuestion(data);
  return res.data;
};

export const updateExamQuestion = async (data) => {
  const res = await editExamQuestion(data);
  return res.data;
};

export const removeExamQuestion = async (id) => {
  const res = await deleteExamQuestion(id);
  return res.data;
};