import {
  getStudentAnswers,
  addStudentAnswer,
  updateStudentAnswer,
  evaluateAnswer,
  deleteStudentAnswer
} from "../api/studentAnswerApi";

// GET
export const fetchStudentAnswers = async (params) => {
  const res = await getStudentAnswers(params);
  return res.data;
};

// CREATE
export const createStudentAnswer = async (data) => {
  const res = await addStudentAnswer(data);
  return res.data;
};

// UPDATE
export const editStudentAnswer = async (data) => {
  const res = await updateStudentAnswer(data);
  return res.data;
};

// EVALUATE
export const evaluateStudentAnswer = async (data) => {
  const res = await evaluateAnswer(data);
  return res.data;
};

// DELETE
export const removeStudentAnswer = async (id) => {
  const res = await deleteStudentAnswer(id);
  return res.data;
};