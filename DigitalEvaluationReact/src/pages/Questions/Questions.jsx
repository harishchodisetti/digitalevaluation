import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";

import {
  fetchQuestions,
  createQuestion,
  removeQuestion,
} from "../../services/questionService";

import "./Questions.css";

console.log("Questions page loaded");

function Questions() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState({});

  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    questionCode: "",
    questionText: "",
    questionType: "Theory",
    difficultyLevel: "Easy",
    maxMarks: "",
    tags: "",
    collegeId: "",
    courseId: "",
    branchId: "",
    subjectId: "",
  });

  // 🔹 VALIDATION
  const validate = () => {
    let err = {};

    if (!form.questionText) err.questionText = "Required";
    if (!form.subjectId) err.subjectId = "Select subject";
    if (!form.maxMarks || form.maxMarks <= 0)
      err.maxMarks = "Enter valid marks";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔹 DROPDOWNS
  const loadDropdowns = async () => {
    try {
      const [c1, c2, c3, c4] = await Promise.all([
        API.get("/Colleges"),
        API.get("/Courses"),
        API.get("/Branches"),
        API.get("/Subjects"),
      ]);

      setColleges(c1.data);
      setCourses(c2.data);
      setBranches(c3.data);
      setSubjects(c4.data);
    } catch {
      toast.error("Dropdown load failed");
    }
  };

  // 🔹 LOAD DATA
  const loadData = async () => {
    try {
      const res = await fetchQuestions({
        pageNumber: page,
        pageSize: 5,
        search,
      });

      setData(res.items || []);
    } catch {
      toast.error("Failed to load questions");
    }
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, search]);

  // 🔥 SUBMIT (ADD)
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        questionCode: form.questionCode,
        questionText: form.questionText,
        questionType: form.questionType,
        difficultyLevel: form.difficultyLevel,

        collegeId: form.collegeId ? Number(form.collegeId) : null,
        courseId: form.courseId ? Number(form.courseId) : null,
        branchId: form.branchId ? Number(form.branchId) : null,
        subjectId: Number(form.subjectId),

        semester: 1,
        unitNumber: 1,

        maxMarks: Number(form.maxMarks),
        isOptional: false,
        tags: form.tags,
      };

      await createQuestion(payload);

      toast.success("Added successfully");

      resetForm();
      loadData();
    } catch (err) {
      console.log(err);
      toast.error("Error adding question");
    }
  };

  // 🔹 RESET FORM
  const resetForm = () => {
    setErrors({});
    setForm({
      questionCode: "",
      questionText: "",
      questionType: "Theory",
      difficultyLevel: "Easy",
      maxMarks: "",
      tags: "",
      collegeId: "",
      courseId: "",
      branchId: "",
      subjectId: "",
    });
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await removeQuestion(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="question-container">
      <h2 className="title">Questions</h2>

      {/* FORM */}
      <div className="question-card">

        <label>Question Code</label>
        <input
          value={form.questionCode}
          onChange={(e) =>
            setForm({ ...form, questionCode: e.target.value })
          }
        />

        <label>Question Text *</label>
        <input
          value={form.questionText}
          onChange={(e) =>
            setForm({ ...form, questionText: e.target.value })
          }
        />
        {errors.questionText && (
          <span className="error">{errors.questionText}</span>
        )}

        <label>College</label>
        <select
          value={form.collegeId}
          onChange={(e) =>
            setForm({ ...form, collegeId: e.target.value })
          }
        >
          <option value="">Select</option>
          {colleges.map((c) => (
            <option key={c.collegeId} value={c.collegeId}>
              {c.collegeName}
            </option>
          ))}
        </select>

        <label>Course</label>
        <select
          value={form.courseId}
          onChange={(e) =>
            setForm({ ...form, courseId: e.target.value })
          }
        >
          <option value="">Select</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </select>

        <label>Branch</label>
        <select
          value={form.branchId}
          onChange={(e) =>
            setForm({ ...form, branchId: e.target.value })
          }
        >
          <option value="">Select</option>
          {branches.map((b) => (
            <option key={b.branchId} value={b.branchId}>
              {b.branchName}
            </option>
          ))}
        </select>

        <label>Subject *</label>
        <select
          value={form.subjectId}
          onChange={(e) =>
            setForm({ ...form, subjectId: e.target.value })
          }
        >
          <option value="">Select</option>
          {subjects.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>
              {s.subjectName}
            </option>
          ))}
        </select>
        {errors.subjectId && (
          <span className="error">{errors.subjectId}</span>
        )}

        <label>Type</label>
        <select
          value={form.questionType}
          onChange={(e) =>
            setForm({ ...form, questionType: e.target.value })
          }
        >
          <option>Theory</option>
          <option>MCQ</option>
          <option>Numerical</option>
        </select>

        <label>Difficulty</label>
        <select
          value={form.difficultyLevel}
          onChange={(e) =>
            setForm({ ...form, difficultyLevel: e.target.value })
          }
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Marks *</label>
        <input
          type="number"
          value={form.maxMarks}
          onChange={(e) =>
            setForm({ ...form, maxMarks: e.target.value })
          }
        />
        {errors.maxMarks && (
          <span className="error">{errors.maxMarks}</span>
        )}

        <label>Tags</label>
        <input
          value={form.tags}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value })
          }
        />

        <button className="add-btn" onClick={handleSubmit}>
          Add
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="search-box"
        placeholder="Search question / code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="table-container">
        <table className="question-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Text</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>Marks</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((q) => (
              <tr key={q.questionId}>
                <td>{q.questionCode}</td>
                <td>{q.questionText}</td>
                <td>{q.questionType}</td>
                <td>{q.difficultyLevel}</td>
                <td>{q.maxMarks}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/questions/edit/${q.questionId}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(q.questionId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Questions;