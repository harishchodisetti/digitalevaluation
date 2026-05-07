import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchRevaluationAssignments,
  createRevaluationAssignment,
  updateAssignmentStatus,
  removeRevaluationAssignment
} from "../../services/revaluationAssignmentService";
import "./RevaluationAssignments.css";

function RevaluationAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    revaluationRequestId: "",
    facultyId: ""
  });

  // Load assignments
  const loadAssignments = useCallback(async () => {
    try {
      const data = await fetchRevaluationAssignments();
      setAssignments(data.items || []); // backend returns PagedResult
    } catch {
      toast.error("Failed to load assignments");
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Add new assignment
  const handleAdd = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Assigning...");
    try {
      await createRevaluationAssignment({
        revaluationRequestId: Number(form.revaluationRequestId),
        facultyId: Number(form.facultyId)
      });
      toast.success("Assignment created ✅", { id: toastId });
      setForm({ revaluationRequestId: "", facultyId: "" });
      loadAssignments();
    } catch {
      toast.error("Assignment failed ❌", { id: toastId });
    }
  };

  // Edit assignment status
  const handleEdit = (row) => {
    setEditId(row.revaluationAssignmentId);
    setEditForm({ ...row });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating...");
    try {
      await updateAssignmentStatus({
        revaluationAssignmentId: editForm.revaluationAssignmentId,
        status: editForm.status
      });
      toast.success("Status updated ✏️", { id: toastId });
      setEditId(null);
      loadAssignments();
    } catch {
      toast.error("Update failed ❌", { id: toastId });
    }
  };

  // Delete assignment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await removeRevaluationAssignment(id);
      toast.success("Deleted 🗑️", { id: toastId });
      loadAssignments();
    } catch {
      toast.error("Delete failed ❌", { id: toastId });
    }
  };

  return (
    <div className="assign-container">
      <h2 className="title">📑 Revaluation Assignments</h2>

      {/* Add Form */}
      <form className="assign-form" onSubmit={handleAdd}>
        <input
          placeholder="Revaluation Request ID"
          value={form.revaluationRequestId}
          onChange={(e)=>setForm({...form, revaluationRequestId:e.target.value})}
          required
        />
        <input
          placeholder="Faculty ID"
          value={form.facultyId}
          onChange={(e)=>setForm({...form, facultyId:e.target.value})}
          required
        />
        <button className="btn add-btn">Assign</button>
      </form>

      {/* Table */}
      <table className="assign-table">
        <thead>
          <tr>
            <th>ID</th><th>Request</th><th>Faculty</th><th>Assigned Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a =>
            editId === a.revaluationAssignmentId ? (
              <tr key={a.revaluationAssignmentId}>
                <td>{a.revaluationAssignmentId}</td>
                <td>{a.revaluationRequestId}</td>
                <td>{a.facultyId}</td>
                <td>{new Date(a.assignedDate).toLocaleDateString()}</td>
                <td>
                  <select name="status" value={editForm.status} onChange={handleEditChange}>
                    <option value="Assigned">Assigned</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button className="btn edit-btn" onClick={handleUpdate}>Save</button>
                  <button className="btn cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={a.revaluationAssignmentId}>
                <td>{a.revaluationAssignmentId}</td>
                <td>{a.revaluationRequestId}</td>
                <td>{a.facultyId}</td>
                <td>{new Date(a.assignedDate).toLocaleDateString()}</td>
                <td>{a.status}</td>
                <td>
                  <button className="btn edit-btn" onClick={() => handleEdit(a)}>Edit</button>
                  <button className="btn delete-btn" onClick={() => handleDelete(a.revaluationAssignmentId)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RevaluationAssignments;
