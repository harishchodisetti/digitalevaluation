import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchEvaluations,
  createEvaluation,
  updateEvaluation,
  removeEvaluation
} from "../../services/evaluationService";

import "./Evaluations.css";

function Evaluations() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    answerSheetId: "",
    facultyId: "",
    totalMarks: "",
    remarks: ""
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // LOAD
  const loadData = async () => {
    const t = toast.loading("Loading...");
    try {
      const res = await fetchEvaluations();
      setData(res || []);
      toast.dismiss(t);
    } catch {
      toast.error("Load failed ❌", { id: t });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.answerSheetId || !form.facultyId) {
      toast.error("Required fields missing");
      return;
    }

    const t = toast.loading("Adding...");

    try {
      await createEvaluation({
        ...form,
        answerSheetId: Number(form.answerSheetId),
        facultyId: Number(form.facultyId),
        totalMarks: Number(form.totalMarks)
      });

      toast.success("Added ✅", { id: t });

      setForm({
        answerSheetId: "",
        facultyId: "",
        totalMarks: "",
        remarks: ""
      });

      loadData();
    } catch {
      toast.error("Failed ❌", { id: t });
    }
  };

  // EDIT
  const handleEdit = (row) => {
    setEditId(row.evaluationId);
    setEditForm({ ...row });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const t = toast.loading("Updating...");

    try {
      await updateEvaluation({
        evaluationId: editForm.evaluationId,
        totalMarks: Number(editForm.totalMarks),
        remarks: editForm.remarks
      });

      toast.success("Updated ✅", { id: t });

      setEditId(null);
      loadData();
    } catch {
      toast.error("Update failed ❌", { id: t });
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    const t = toast.loading("Deleting...");

    try {
      await removeEvaluation(id);
      toast.success("Deleted 🗑️", { id: t });
      loadData();
    } catch {
      toast.error("Delete failed ❌", { id: t });
    }
  };

  // FILTER
  const filtered = data.filter((x) => {
    const val = search.toLowerCase();
    return (
      String(x.answerSheetId).includes(val) ||
      String(x.facultyId).includes(val)
    );
  });

  // PAGINATION
  const indexLast = currentPage * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;
  const currentRows = filtered.slice(indexFirst, indexLast);

  return (
    <div className="faculty-container">
      <h2 className="title">📝 Evaluation Management</h2>

      {/* FORM */}
      <form className="faculty-card" onSubmit={handleAdd}>
        <label>Answer Sheet ID</label>
        <input
          name="answerSheetId"
          value={form.answerSheetId}
          onChange={handleChange}
        />

        <label>Faculty ID</label>
        <input
          name="facultyId"
          value={form.facultyId}
          onChange={handleChange}
        />

        <label>Total Marks</label>
        <input
          name="totalMarks"
          value={form.totalMarks}
          onChange={handleChange}
        />

        <label>Remarks</label>
        <input
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
        />

        <button className="btn add-btn">Add Evaluation</button>
      </form>

      {/* TABLE */}
      <div className="table-container">
        <div className="table-header">
          <input
            className="search-box"
            placeholder="Search by sheet / faculty..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="faculty-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sheet</th>
              <th>Faculty</th>
              <th>Marks</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row) =>
              editId === row.evaluationId ? (
                <tr key={row.evaluationId}>
                  <td>{row.evaluationId}</td>
                  <td>{row.answerSheetId}</td>
                  <td>{row.facultyId}</td>

                  <td>
                    <input
                      name="totalMarks"
                      value={editForm.totalMarks}
                      onChange={handleEditChange}
                    />
                  </td>

                  <td>
                    <input
                      name="remarks"
                      value={editForm.remarks}
                      onChange={handleEditChange}
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
                <tr key={row.evaluationId}>
                  <td>{row.evaluationId}</td>
                  <td>{row.answerSheetId}</td>
                  <td>{row.facultyId}</td>
                  <td>{row.totalMarks}</td>
                  <td>{row.remarks}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(row.evaluationId)}
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
            disabled={indexLast >= filtered.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Evaluations;