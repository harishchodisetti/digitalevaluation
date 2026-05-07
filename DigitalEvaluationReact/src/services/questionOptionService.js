import {
  getOptions,
  addOption,
  updateOption,
  deleteOption,
} from "../api/questionOptionApi";

export const fetchOptions = async (params) => {
  const res = await getOptions(params);
  return res.data;
};

export const createOption = async (data) => {
  const res = await addOption(data);
  return res.data;
};

export const editOption = async (data) => {
  const res = await updateOption(data);
  return res.data;
};

export const removeOption = async (id) => {
  const res = await deleteOption(id);
  return res.data;
};