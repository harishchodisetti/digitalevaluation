import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchExams,
  createExam,
  updateExam,
  removeExam
} from "../../services/examService";

import { fetchCourses } from "../../services/courseService";
import { fetchBranches } from "../../services/branchService";

import "./Exams.css";

function Exams() {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    examName: "",
    examType: "",
    semester: "",
    academicYear: "",
    startDate: "",
    endDate: "",
    courseId: "",
    branchId: ""
  });

  const [errors, setErrors] = useState({});

  // LOAD
  const loadAll = async () => {
    const [e, c, b] = await Promise.all([
      fetchExams(),
      fetchCourses(),
      fetchBranches()
    ]);

    setData(e || []);
    setCourses(c || []);
    setBranches(b || []);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // VALIDATION
  const validate = (obj) => {
    let err = {};

    if (!obj.examName?.trim()) err.examName = "Required";
    if (!obj.examType) err.examType = "Select type";
    if (!obj.semester) err.semester = "Required";
    if (!obj.academicYear) err.academicYear = "Required";
    if (!obj.startDate) err.startDate = "Required";
    if (!obj.endDate) err.endDate = "Required";
    if (!obj.courseId) err.courseId = "Select course";
    if (!obj.branchId) err.branchId = "Select branch";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // ADD
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;

    const t = toast.loading("Saving...");

    try {
      await createExam({
        ...form,
        semester: Number(form.semester),
        courseId: Number(form.courseId),
        branchId: Number(form.branchId)
      });

      toast.success("Added ✅", { id: t });
      loadAll();

      setForm({
        examName: "",
        examType: "",
        semester: "",
        academicYear: "",
        startDate: "",
        endDate: "",
        courseId: "",
        branchId: ""
      });
    } catch {
      toast.error("Error ❌", { id: t });
    }
  };

  // EDIT
  const handleEdit = (row) => {
    setEditId(row.examId);
    setEditForm(row);
  };

  const handleUpdate = async () => {
    const t = toast.loading("Updating...");

    try {
      await updateExam(editForm);
      toast.success("Updated ✅", { id: t });

      setEditId(null);
      loadAll();
    } catch {
      toast.error("Update failed ❌", { id: t });
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete exam?")) return;

    const t = toast.loading("Deleting...");

    try {
      await removeExam(id);
      toast.success("Deleted 🗑️", { id: t });
      loadAll();
    } catch {
      toast.error("Delete failed ❌", { id: t });
    }
  };

  return (
    <div className="exam-page">
      <h2 className="title">Exam Management</h2>

      {/* FORM */}
      <form className="exam-card" onSubmit={handleAdd}>
        <input name="examName" placeholder="Exam Name" value={form.examName} onChange={handleChange} />
        
        <select name="examType" value={form.examType} onChange={handleChange}>
          <option value="">Type</option>
          <option value="Internal">Internal</option>
          <option value="External">External</option>
        </select>

        <input type="number" name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} />
        <input name="academicYear" placeholder="Academic Year" value={form.academicYear} onChange={handleChange} />

        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

        <select name="courseId" value={form.courseId} onChange={handleChange}>
          <option value="">Course</option>
          {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
        </select>

        <select name="branchId" value={form.branchId} onChange={handleChange}>
          <option value="">Branch</option>
          {branches.map(b => <option key={b.branchId} value={b.branchId}>{b.branchName}</option>)}
        </select>

        <button className="btn add-btn">Add Exam</button>
      </form>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>ID</th> {/* ✅ ADDED */}
              <th>Name</th>
              <th>Type</th>
              <th>Sem</th>
              <th>Year</th>
              <th>Dates</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map(row =>
              editId === row.examId ? (
                <tr key={row.examId}>
                  <td>{row.examId}</td> {/* ✅ SHOW ID */}

                  <td><input name="examName" value={editForm.examName} onChange={handleEditChange} /></td>

                  <td>
                    <select name="examType" value={editForm.examType} onChange={handleEditChange}>
                      <option value="Internal">Internal</option>
                      <option value="External">External</option>
                    </select>
                  </td>

                  <td><input name="semester" value={editForm.semester} onChange={handleEditChange} /></td>
                  <td><input name="academicYear" value={editForm.academicYear} onChange={handleEditChange} /></td>

                  <td>
                    <input type="date" name="startDate" value={editForm.startDate?.split("T")[0]} onChange={handleEditChange} />
                    <input type="date" name="endDate" value={editForm.endDate?.split("T")[0]} onChange={handleEditChange} />
                  </td>

                  <td>{editForm.courseId}</td>
                  <td>{editForm.branchId}</td>

                  <td>
                    <button className="btn add-btn" onClick={handleUpdate}>Save</button>
                    <button className="btn cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={row.examId}>
                  <td>{row.examId}</td> {/* ✅ MAIN FIX */}
                  <td>{row.examName}</td>
                  <td>{row.examType}</td>
                  <td>{row.semester}</td>
                  <td>{row.academicYear}</td>
                  <td>{row.startDate?.split("T")[0]} - {row.endDate?.split("T")[0]}</td>
                  <td>{row.courseId}</td>
                  <td>{row.branchId}</td>
                  <td>
                    <button className="btn edit-btn" onClick={() => handleEdit(row)}>Edit</button>
                    <button className="btn delete-btn" onClick={() => handleDelete(row.examId)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Exams;