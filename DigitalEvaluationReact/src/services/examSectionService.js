import {
  getExamSections,
  addExamSection,
  editExamSection,
  deleteExamSection
} from "../api/examSectionApi";

// GET ALL
export const fetchExamSections = async (params) => {
  const res = await getExamSections(params);
  return res.data;
};

// CREATE
export const createExamSection = async (data) => {
  const res = await addExamSection(data);
  return res.data;
};

// UPDATE
export const updateExamSection = async (data) => {
  const res = await editExamSection(data);
  return res.data;
};

// DELETE
export const removeExamSection = async (id) => {
  const res = await deleteExamSection(id);
  return res.data;
};