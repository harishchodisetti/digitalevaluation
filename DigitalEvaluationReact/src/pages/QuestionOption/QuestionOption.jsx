import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchOptions,
  createOption,
  editOption,
  removeOption,
} from "../../services/questionOptionService";

import "./QuestionOption.css";

function QuestionOptions() {
  const { id } = useParams();
  const questionId = Number(id); // ✅ VERY IMPORTANT

  const [options, setOptions] = useState([]);
  const [optionText, setOptionText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // LOAD OPTIONS
  const loadOptions = async () => {
    try {
      if (!questionId) return;

      const res = await fetchOptions({ questionId });
      setOptions(Array.isArray(res) ? res : []);
    } catch {
      toast.error("Failed to load options");
    }
  };

  useEffect(() => {
    loadOptions();
  }, [questionId]);

  // ADD OPTION
  const handleAdd = async () => {
    if (!optionText.trim()) {
      toast.error("Enter option text");
      return;
    }

    if (!questionId) {
      toast.error("Invalid QuestionId");
      return;
    }

    try {
      await createOption({
        questionId: questionId,
        optionText: optionText.trim(),
        isCorrect: isCorrect,
      });

      toast.success("Option added");

      setOptionText("");
      setIsCorrect(false);

      loadOptions();
    } catch (err) {
      toast.error(err.response?.data?.title || "Error");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete option?")) return;

    try {
      await removeOption(id);
      toast.success("Deleted");
      loadOptions();
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT START
  const startEdit = (opt) => {
    setEditingId(opt.optionId);
    setEditText(opt.optionText);
  };

  // SAVE EDIT
  const saveEdit = async (opt) => {
    if (!editText.trim()) {
      toast.error("Enter option");
      return;
    }

    try {
      await editOption({
        optionId: opt.optionId,
        questionId: opt.questionId,
        optionText: editText,
        isCorrect: opt.isCorrect,
      });

      toast.success("Updated");
      setEditingId(null);
      loadOptions();
    } catch {
      toast.error("Update failed");
    }
  };

  // SET CORRECT
  const setCorrect = async (opt) => {
    try {
      await editOption({
        optionId: opt.optionId,
        questionId: opt.questionId,
        optionText: opt.optionText,
        isCorrect: true,
      });

      toast.success("Correct answer updated");
      loadOptions();
    } catch (err) {
      toast.error(err.response?.data || "Error");
    }
  };

  return (
    <div className="option-container">
      <h3>Question Options</h3>

      {/* ADD */}
      <div className="option-add">
        <input
          type="text"
          placeholder="Enter option text"
          value={optionText}
          onChange={(e) => setOptionText(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
          />
          Correct
        </label>

        <button onClick={handleAdd}>Add</button>
      </div>

      {/* TABLE */}
      <table className="option-table">
        <thead>
          <tr>
            <th>Option</th>
            <th>Correct</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {options.length === 0 ? (
            <tr>
              <td colSpan="3">No options found</td>
            </tr>
          ) : (
            options.map((opt) => (
              <tr key={opt.optionId}>
                <td>
                  {editingId === opt.optionId ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                  ) : (
                    opt.optionText
                  )}
                </td>

                <td>
                  <input
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => setCorrect(opt)}
                  />
                </td>

                <td>
                  {editingId === opt.optionId ? (
                    <>
                      <button onClick={() => saveEdit(opt)}>Save</button>
                      <button onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(opt)}>Edit</button>
                      <button onClick={() => handleDelete(opt.optionId)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuestionOptions;