import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAssignments,
  addAssignment,
  removeAssignment,
  editAssignment
} from "../../services/studentExamAssignmentService";
import "./StudentExamAssignments.css";

function StudentExamAssignments() {
  const { user, accessToken } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentExamAssignmentId: null, // ✅ include ID for updates
    studentId: "",
    examId: "",
    examDate: "",
    startTime: "",
    endTime: "",
    status: "Assigned",
    attemptNumber: 1,
    createdBy: user?.username || "System"
  });
  const [editing, setEditing] = useState(false);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await fetchAssignments(1, 10);
      setAssignments(data);
    } catch (err) {
      console.error("Assignments load failed:", err);
      alert("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      loadAssignments();
    }
  }, [user, accessToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // ✅ send only fields backend expects
        await editAssignment({
          studentExamAssignmentId: form.studentExamAssignmentId,
          status: form.status,
          startTime: form.startTime || null,
          endTime: form.endTime || null
        });
        setEditing(false);
      } else {
        await addAssignment(form);
      }
      loadAssignments();
      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.response?.data || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await removeAssignment(id);
      loadAssignments();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const handleEditClick = (assignment) => {
    setEditing(true);
    setForm({
      studentExamAssignmentId: assignment.studentExamAssignmentId, // ✅ keep ID
      studentId: assignment.studentId,
      examId: assignment.examId,
      examDate: assignment.examDate ? assignment.examDate.split("T")[0] : "",
      startTime: assignment.startTime || "",
      endTime: assignment.endTime || "",
      status: assignment.status,
      attemptNumber: assignment.attemptNumber || 1,
      createdBy: user?.username || "System"
    });
  };

  const resetForm = () => {
    setForm({
      studentExamAssignmentId: null,
      studentId: "",
      examId: "",
      examDate: "",
      startTime: "",
      endTime: "",
      status: "Assigned",
      attemptNumber: 1,
      createdBy: user?.username || "System"
    });
  };

  return (
    <div className="assignment-container">
      <h2>Student Exam Assignments</h2>

      <form className="assignment-form" onSubmit={handleCreateOrUpdate}>
        <label>
          Student ID
          <input
            name="studentId"
            type="number"
            value={form.studentId}
            onChange={handleChange}
            required
            disabled={editing} // ✅ prevent changing IDs on update
          />
        </label>
        <label>
          Exam ID
          <input
            name="examId"
            type="number"
            value={form.examId}
            onChange={handleChange}
            required
            disabled={editing}
          />
        </label>
        <label>
          Exam Date
          <input
            name="examDate"
            type="date"
            value={form.examDate}
            onChange={handleChange}
            disabled={editing}
          />
        </label>
        <label>
          Start Time
          <input
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
          />
        </label>
        <label>
          End Time
          <input
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
          />
        </label>
        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Assigned</option>
            <option>InProgress</option>
            <option>Completed</option>
            <option>Absent</option>
            <option>Evaluated</option>
          </select>
        </label>
        <label>
          Attempt Number
          <input
            name="attemptNumber"
            type="number"
            value={form.attemptNumber}
            onChange={handleChange}
            min="1"
            disabled={editing}
          />
        </label>
        <div className="form-actions">
          <button type="submit">
            {editing ? "Update Assignment" : "Create Assignment"}
          </button>
          {editing && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditing(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="assignment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Exam</th>
              <th>Status</th>
              <th>Exam Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.studentExamAssignmentId}>
                <td>{a.studentExamAssignmentId}</td>
                <td>{a.studentId}</td>
                <td>{a.examId}</td>
                <td>{a.status}</td>
                <td>{a.examDate ? new Date(a.examDate).toLocaleDateString() : "-"}</td>
                <td>
                  <button onClick={() => handleEditClick(a)}>Edit</button>
                  <button onClick={() => handleDelete(a.studentExamAssignmentId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentExamAssignments;
