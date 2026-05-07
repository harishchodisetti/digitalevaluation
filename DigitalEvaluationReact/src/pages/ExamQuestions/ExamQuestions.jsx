import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchExamQuestions,
  createExamQuestion,
  updateExamQuestion,
  removeExamQuestion
} from "../../services/examQuestionService";

import "./ExamQuestions.css";

function ExamQuestions() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    examId: "",
    questionId: "",
    section: "",
    questionNumber: "",
    maxMarks: "",
    isCompulsory: true
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // LOAD
  const loadData = async () => {
    const res = await fetchExamQuestions({
      pageNumber: 1,
      pageSize: 100
    });
    setData(res.items || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // FILTER
  const filtered = data.filter((x) =>
    x.section?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * recordsPerPage;
  const currentRecords = filtered.slice(
    indexOfLast - recordsPerPage,
    indexOfLast
  );

  // VALIDATION
  const validate = () => {
    let e = {};

    if (!form.examId) e.examId = "Exam required";
    if (!form.questionId) e.questionId = "Question required";
    if (!form.section) e.section = "Section required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value === ""
          ? ""
          : Number(value) || value
    });

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  // ADD

  const handleAdd = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const t = toast.loading("Adding question...");

  try {
    await createExamQuestion({
      examId: Number(form.examId),
      questionId: Number(form.questionId),
      section: String(form.section),
      questionNumber: Number(form.questionNumber),
      maxMarks: Number(form.maxMarks),
      isCompulsory: Boolean(form.isCompulsory)
    });

    toast.success("Added ✅", { id: t });

    loadData();

    setForm({
      examId: "",
      questionId: "",
      section: "",
      questionNumber: "",
      maxMarks: "",
      isCompulsory: true
    });
  } catch (err) {
    const msg =
      err?.response?.data?.title ||
      err?.response?.data?.message ||
      "Failed ❌";

    toast.error(msg, { id: t });
  }
};



  
  // EDIT
  const handleEdit = (row) => {
    setEditId(row.examQuestionId);
    setEditForm({ ...row });
  };

  const handleUpdate = async () => {
    const t = toast.loading("Updating...");

    try {
      await updateExamQuestion(editForm);
      toast.success("Updated ✅", { id: t });
      setEditId(null);
      loadData();
    } catch {
      toast.error("Update failed ❌", { id: t });
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    const t = toast.loading("Deleting...");

    try {
      await removeExamQuestion(id);
      toast.success("Deleted 🗑️", { id: t });
      loadData();
    } catch {
      toast.error("Delete failed ❌", { id: t });
    }
  };

  return (
    <div className="faculty-container">
      <h2 className="title">🧾 Exam Questions</h2>

      {/* FORM */}
      <form className="faculty-card" onSubmit={handleAdd}>
        <label>Exam Id</label>
        <input name="examId" value={form.examId} onChange={handleChange} />
        {errors.examId && <p className="error">{errors.examId}</p>}

        <label>Question Id</label>
        <input name="questionId" value={form.questionId} onChange={handleChange} />
        {errors.questionId && <p className="error">{errors.questionId}</p>}

        <label>Section</label>
        <input name="section" value={form.section} onChange={handleChange} />
        {errors.section && <p className="error">{errors.section}</p>}

        <label>Question Number</label>
        <input
          type="number"
          name="questionNumber"
          value={form.questionNumber}
          onChange={handleChange}
        />

        <label>Marks</label>
        <input
          type="number"
          name="maxMarks"
          value={form.maxMarks}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="isCompulsory"
            checked={form.isCompulsory}
            onChange={handleChange}
          />
          Is Compulsory
        </label>

        <button className="btn add-btn">Add Question</button>
      </form>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-header">
          <input
            className="search-box"
            placeholder="Search section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="faculty-table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>QId</th>
              <th>Section</th>
              <th>No</th>
              <th>Marks</th>
              <th>Compulsory</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((row) =>
              editId === row.examQuestionId ? (
                <tr key={row.examQuestionId}>
                  <td>{row.examId}</td>
                  <td>{row.questionId}</td>
                  <td>
                    <input
                      value={editForm.section}
                      onChange={(e) =>
                        setEditForm({ ...editForm, section: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.questionNumber}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          questionNumber: e.target.value
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.maxMarks}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          maxMarks: e.target.value
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editForm.isCompulsory}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          isCompulsory: e.target.checked
                        })
                      }
                    />
                  </td>
                  <td>
                    <button className="btn edit-btn" onClick={handleUpdate}>
                      Save
                    </button>
                    <button
                      className="btn cancel-btn"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={row.examQuestionId}>
                  <td>{row.examId}</td>
                  <td>{row.questionId}</td>
                  <td>{row.section}</td>
                  <td>{row.questionNumber}</td>
                  <td>{row.maxMarks}</td>
                  <td>{row.isCompulsory ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(row.examQuestionId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            className="btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span>Page {currentPage}</span>

          <button
            className="btn"
            disabled={indexOfLast >= filtered.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

}


export default ExamQuestions;