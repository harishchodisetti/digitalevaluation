import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchStudentAnswers,
  createStudentAnswer,
  editStudentAnswer,
  evaluateStudentAnswer,
  removeStudentAnswer
} from "../../services/studentAnswerService";

import "./StudentAnswers.css";

function StudentAnswers() {
  const [answers, setAnswers] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    answerSheetId: "",
    questionId: "",
    answerText: "",
    file: null
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // ================= LOAD =================
  const loadAnswers = async () => {
    try {
      const res = await fetchStudentAnswers({
        PageNumber: currentPage,
        PageSize: recordsPerPage
      });

      setAnswers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAnswers();
  }, [currentPage]);

  // ================= FILTER =================
  const filteredData = answers.filter((a) =>
    a.questionText?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= ADD =================
  const handleAdd = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("AnswerSheetId", form.answerSheetId);
    formData.append("QuestionId", form.questionId);
    formData.append("AnswerText", form.answerText);
    if (form.file) formData.append("File", form.file);

    const t = toast.loading("Submitting answer...");

    try {
      await createStudentAnswer(formData);
      toast.success("Submitted ✅", { id: t });

      loadAnswers();
      setForm({
        answerSheetId: "",
        questionId: "",
        answerText: "",
        file: null
      });
    } catch {
      toast.error("Failed ❌", { id: t });
    }
  };

  // ================= EDIT =================
  const handleEdit = (a) => {
    setEditId(a.studentAnswerId);
    setEditForm({ ...a });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setEditForm({ ...editForm, file: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("StudentAnswerId", editForm.studentAnswerId);
    formData.append("AnswerText", editForm.answerText);
    if (editForm.file) formData.append("File", editForm.file);

    const t = toast.loading("Updating...");

    try {
      await editStudentAnswer(formData);
      toast.success("Updated ✅", { id: t });

      setEditId(null);
      loadAnswers();
    } catch {
      toast.error("Update failed ❌", { id: t });
    }
  };

  // ================= EVALUATE =================
  const handleEvaluate = async (id) => {
    const marks = prompt("Enter Marks:");
    if (!marks) return;

    const remarks = prompt("Enter Remarks:");

    const t = toast.loading("Evaluating...");

    try {
      await evaluateStudentAnswer({
        studentAnswerId: id,
        marksAwarded: Number(marks),
        evaluatorRemarks: remarks
      });

      toast.success("Evaluated ✅", { id: t });
      loadAnswers();
    } catch {
      toast.error("Failed ❌", { id: t });
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this answer?")) return;

    const t = toast.loading("Deleting...");

    try {
      await removeStudentAnswer(id);
      toast.success("Deleted 🗑️", { id: t });
      loadAnswers();
    } catch {
      toast.error("Delete failed ❌", { id: t });
    }
  };

  // ================= PAGINATION =================
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);

  return (
    <div className="faculty-container">
      <h2 className="title">📝 Student Answers</h2>

      {/* FORM */}
      <form className="faculty-card" onSubmit={handleAdd}>
        <label>Answer Sheet Id</label>
        <input name="answerSheetId" value={form.answerSheetId} onChange={handleChange} />

        <label>Question Id</label>
        <input name="questionId" value={form.questionId} onChange={handleChange} />

        <label>Answer</label>
        <input name="answerText" value={form.answerText} onChange={handleChange} />

        <label>Upload File</label>
        <input type="file" name="file" onChange={handleChange} />

        <button className="btn add-btn">Submit Answer</button>
      </form>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-header">
          <input
            className="search-box"
            placeholder="Search question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="faculty-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Marks</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((a) =>
              editId === a.studentAnswerId ? (
                <tr key={a.studentAnswerId}>
                  <td>{a.questionText}</td>
                  <td>
                    <input
                      name="answerText"
                      value={editForm.answerText}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>{a.marksAwarded}</td>
                  <td>{a.evaluatorRemarks}</td>
                  <td>
                    <button className="btn edit-btn" onClick={handleUpdate}>
                      Save
                    </button>
                    <button className="btn cancel-btn" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={a.studentAnswerId}>
                  <td>{a.questionText}</td>
                  <td>{a.answerText}</td>
                  <td>{a.marksAwarded || "-"}</td>
                  <td>{a.evaluatorRemarks || "-"}</td>
                  <td>
                    <button className="btn edit-btn" onClick={() => handleEdit(a)}>
                      Edit
                    </button>
                    <button className="btn add-btn" onClick={() => handleEvaluate(a.studentAnswerId)}>
                      Evaluate
                    </button>
                    <button className="btn delete-btn" onClick={() => handleDelete(a.studentAnswerId)}>
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
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentAnswers;