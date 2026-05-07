import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { editQuestion } from "../../services/questionService";
import "./Questions.css";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // 🔹 LOAD DROPDOWNS + DATA
  useEffect(() => {
    loadDropdowns();
    loadQuestion();
  }, []);

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

  const loadQuestion = async () => {
    try {
      const res = await API.get(`/Questions/${id}`);
      setForm(res.data);
    } catch {
      toast.error("Failed to load question");
      navigate("/questions");
    }
  };

  // 🔹 VALIDATION
  const validate = () => {
    let err = {};
    if (!form.questionText) err.questionText = "Required";
    if (!form.subjectId) err.subjectId = "Required";
    if (!form.maxMarks || form.maxMarks <= 0)
      err.maxMarks = "Invalid";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔥 UPDATE
  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      await editQuestion({
        ...form,
        collegeId: Number(form.collegeId),
        courseId: Number(form.courseId),
        branchId: Number(form.branchId),
        subjectId: Number(form.subjectId),
        maxMarks: Number(form.maxMarks),
      });

      toast.success("Updated Successfully");
      navigate("/questions");
    } catch {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="question-container">
      <h2 className="title">Edit Question</h2>

      <div className="question-card">

        <label>Question Code</label>
        <input
          value={form.questionCode || ""}
          onChange={(e) =>
            setForm({ ...form, questionCode: e.target.value })
          }
        />

        <label>Question Text *</label>
        <input
          value={form.questionText || ""}
          onChange={(e) =>
            setForm({ ...form, questionText: e.target.value })
          }
        />
        {errors.questionText && <span className="error">{errors.questionText}</span>}

        <label>College</label>
        <select
          value={form.collegeId || ""}
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
          value={form.courseId || ""}
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
          value={form.branchId || ""}
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
          value={form.subjectId || ""}
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

        <label>Type</label>
        <select
          value={form.questionType || ""}
          onChange={(e) =>
            setForm({ ...form, questionType: e.target.value })
          }
        >
          <option>Theory</option>
          <option>MCQ</option>
        </select>

        <label>Difficulty</label>
        <select
          value={form.difficultyLevel || ""}
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
          value={form.maxMarks || ""}
          onChange={(e) =>
            setForm({ ...form, maxMarks: e.target.value })
          }
        />
        {errors.maxMarks && <span className="error">{errors.maxMarks}</span>}

        <label>Tags</label>
        <input
          value={form.tags || ""}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value })
          }
        />

        <button className="add-btn" onClick={handleUpdate}>
          Update
        </button>

        <button
          className="cancel-btn"
          onClick={() => navigate("/questions")}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default EditQuestion;