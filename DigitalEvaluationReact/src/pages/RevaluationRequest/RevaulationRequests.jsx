import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchRevaluationRequests,
  createRevaluationRequest,
  updateRevaluationStatus,
  removeRevaluationRequest
} from "../../services/revaluationService";
import "./RevaluationRequests.css";

function RevaluationRequests() {
  const [requests, setRequests] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    studentId: "",
    examId: "",
    subjectId: "",
    originalMarks: "",
    reason: ""
  });

  // Load requests
  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchRevaluationRequests();
      setRequests(data || []);
    } catch {
      toast.error("Failed to load requests");
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Add new request
  const handleAdd = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Submitting...");
    try {
      await createRevaluationRequest({
        ...form,
        originalMarks: Number(form.originalMarks)
      });
      toast.success("Request submitted ✅", { id: toastId });
      setForm({ studentId: "", examId: "", subjectId: "", originalMarks: "", reason: "" });
      loadRequests();
    } catch {
      toast.error("Submit failed ❌", { id: toastId });
    }
  };

  // Edit request status
  const handleEdit = (row) => {
    setEditId(row.revaluationRequestId);
    setEditForm({ ...row });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating...");
    try {
      // ✅ Payload matches Swagger DTO
      const payload = {
        revaluationRequestId: editForm.revaluationRequestId,
        status: editForm.status,
        remarks: editForm.remarks,
        approvedBy: 1 // must be a number, not string
      };

      console.log("Payload being sent:", payload);

      await updateRevaluationStatus(payload);
      toast.success("Status updated ✏️", { id: toastId });
      setEditId(null);
      loadRequests();
    } catch {
      toast.error("Update failed ❌", { id: toastId });
    }
  };

  // Delete request
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await removeRevaluationRequest(id);
      toast.success("Deleted 🗑️", { id: toastId });
      loadRequests();
    } catch {
      toast.error("Delete failed ❌", { id: toastId });
    }
  };

  return (
    <div className="reval-container">
      <h2 className="title">📄 Revaluation Requests</h2>

      {/* Add Form */}
      <form className="reval-form" onSubmit={handleAdd}>
        <input placeholder="Student ID" value={form.studentId} onChange={(e)=>setForm({...form, studentId:e.target.value})} required />
        <input placeholder="Exam ID" value={form.examId} onChange={(e)=>setForm({...form, examId:e.target.value})} required />
        <input placeholder="Subject ID" value={form.subjectId} onChange={(e)=>setForm({...form, subjectId:e.target.value})} required />
        <input placeholder="Original Marks" value={form.originalMarks} onChange={(e)=>setForm({...form, originalMarks:e.target.value})} />
        <input placeholder="Reason" value={form.reason} onChange={(e)=>setForm({...form, reason:e.target.value})} />
        <button className="btn add-btn">Submit Request</button>
      </form>

      {/* Table */}
      <table className="reval-table">
        <thead>
          <tr>
            <th>ID</th><th>Student</th><th>Exam</th><th>Subject</th>
            <th>Marks</th><th>Reason</th><th>Date</th><th>Status</th><th>Remarks</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r =>
            editId === r.revaluationRequestId ? (
              <tr key={r.revaluationRequestId}>
                <td>{r.revaluationRequestId}</td>
                <td>{r.studentId}</td>
                <td>{r.examId}</td>
                <td>{r.subjectId}</td>
                <td>{r.originalMarks}</td>
                <td>{r.reason}</td>
                <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                <td>
                  <select name="status" value={editForm.status} onChange={handleEditChange}>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td><input name="remarks" value={editForm.remarks || ""} onChange={handleEditChange} /></td>
                <td>
                  <button className="btn edit-btn" onClick={handleUpdate}>Save</button>
                  <button className="btn cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={r.revaluationRequestId}>
                <td>{r.revaluationRequestId}</td>
                <td>{r.studentId}</td>
                <td>{r.examId}</td>
                <td>{r.subjectId}</td>
                <td>{r.originalMarks}</td>
                <td>{r.reason}</td>
                <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                <td>{r.status}</td>
                <td>{r.remarks || "-"}</td>
                <td>
                  <button className="btn edit-btn" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="btn delete-btn" onClick={() => handleDelete(r.revaluationRequestId)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RevaluationRequests;
