import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchExamSections,
  createExamSection,
  updateExamSection,
  removeExamSection
} from "../../services/examSectionService";

import "./ExamSections.css"; // reuse same CSS

function ExamSections() {
  const [sections, setSections] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    examId: "",
    sectionName: "",
    totalQuestions: "",
    answerRequired: "",
    marksPerQuestion: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // LOAD
  const loadData = async () => {
    const data = await fetchExamSections({
      pageNumber: 1,
      pageSize: 100
    });
    setSections(data.items || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // FILTER
  const filtered = sections.filter((s) =>
    s.sectionName?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * recordsPerPage;
  const currentRecords = filtered.slice(
    indexOfLast - recordsPerPage,
    indexOfLast
  );

  // VALIDATION
  
   
  const validate = () => {
  let e = {};

  const total = Number(form.totalQuestions);
  const answer = Number(form.answerRequired);

  if (!form.examId) e.examId = "Exam required";
  if (!form.sectionName) e.sectionName = "Section name required";

  if (answer > total) {
    e.answerRequired = "Must be ≤ Total Questions";
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};






  // INPUT
  
    const handleChange = (e) => {
  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: value === "" ? "" : Number(value) || value
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

    const t = toast.loading("Adding section...");

    try {
      await createExamSection({
        examId: Number(form.examId),
        sectionName: form.sectionName,
        totalQuestions: Number(form.totalQuestions),
        answerRequired: Number(form.answerRequired),
        marksPerQuestion: Number(form.marksPerQuestion)
      });

      toast.success("Section Added ✅", { id: t });

      loadData();
      setForm({});
    } catch {
      toast.error("Failed ❌", { id: t });
    }
  };

  // EDIT
  const handleEdit = (s) => {
    setEditId(s.sectionId);
    setEditForm({ ...s });
  };

  const handleUpdate = async () => {
    const t = toast.loading("Updating...");

    try {
      await updateExamSection(editForm);
      toast.success("Updated ✅", { id: t });
      setEditId(null);
      loadData();
    } catch {
      toast.error("Update failed ❌", { id: t });
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete section?")) return;

    const t = toast.loading("Deleting...");

    try {
      await removeExamSection(id);
      toast.success("Deleted 🗑️", { id: t });
      loadData();
    } catch {
      toast.error("Delete failed ❌", { id: t });
    }
  };

  return (
    <div className="faculty-container">
      <h2 className="title">📝 Exam Sections</h2>

      {/* FORM */}
      <form className="faculty-card" onSubmit={handleAdd}>
        <label>Exam Id</label>
        <input
          name="examId"
          value={form.examId || ""}
          onChange={handleChange}
        />
        {errors.examId && <p className="error">{errors.examId}</p>}

        <label>Section Name</label>
        <input
          name="sectionName"
          value={form.sectionName || ""}
          onChange={handleChange}
        />
        {errors.sectionName && (
          <p className="error">{errors.sectionName}</p>
        )}

        <label>Total Questions</label>
        <input
          type="number"
          name="totalQuestions"
          value={form.totalQuestions || ""}
          onChange={handleChange}
        />

        <label>Answer Required</label>
        <input
          type="number"
          name="answerRequired"
          value={form.answerRequired || ""}
          onChange={handleChange}
          className={errors.answerRequired ? "input-error" : ""}
        />
        {errors.answerRequired && (
          <p className="error">{errors.answerRequired}</p>
        )}

        <label>Marks Per Question</label>
        <input
          type="number"
          name="marksPerQuestion"
          value={form.marksPerQuestion || ""}
          onChange={handleChange}
        />

        <button className="btn add-btn">Add Section</button>
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
              <th>ExamId</th>
              <th>Name</th>
              <th>Total</th>
              <th>Answer</th>
              <th>Marks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((s) =>
              editId === s.sectionId ? (
                <tr key={s.sectionId}>
                  <td>{s.examId}</td>
                  <td>
                    <input
                      value={editForm.sectionName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          sectionName: e.target.value
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.totalQuestions}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          totalQuestions: e.target.value
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.answerRequired}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          answerRequired: e.target.value
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editForm.marksPerQuestion}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          marksPerQuestion: e.target.value
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
                <tr key={s.sectionId}>
                  <td>{s.examId}</td>
                  <td>{s.sectionName}</td>
                  <td>{s.totalQuestions}</td>
                  <td>{s.answerRequired}</td>
                  <td>{s.marksPerQuestion}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(s.sectionId)}
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

export default ExamSections;