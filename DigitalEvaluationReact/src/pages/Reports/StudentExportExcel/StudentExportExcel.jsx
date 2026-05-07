import { useState } from "react";
import toast from "react-hot-toast";
import { downloadStudentExcel } from "../../../services/reports/studentExportService.js";

import "./StudentExportExcel.css";

function StudentExportExcel() {
  const [filters, setFilters] = useState({
    studentId: "",
    examId: "",
    subjectId: "",
    evaluatorId: "",
    fromDate: "",
    toDate: "",
    search: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // 📥 DOWNLOAD EXCEL
  const handleDownload = async () => {
    try {
      setLoading(true);

      const blob = await downloadStudentExcel({
        studentId: filters.studentId ? Number(filters.studentId) : null,
        examId: filters.examId ? Number(filters.examId) : null,
        subjectId: filters.subjectId ? Number(filters.subjectId) : null,
        evaluatorId: filters.evaluatorId ? Number(filters.evaluatorId) : null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        search: filters.search || "",
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "StudentResults.xlsx");
      document.body.appendChild(link);
      link.click();

      toast.success("Excel downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Excel download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-container">
      <h2 className="title">📥 Export Student Report (Excel)</h2>

      {/* 🔍 FILTERS */}
      <div className="filters-grid">
        <input name="studentId" placeholder="Student ID" onChange={handleChange} />
        <input name="examId" placeholder="Exam ID" onChange={handleChange} />
        <input name="subjectId" placeholder="Subject ID" onChange={handleChange} />
        <input name="evaluatorId" placeholder="Evaluator ID" onChange={handleChange} />

        <input type="date" name="fromDate" onChange={handleChange} />
        <input type="date" name="toDate" onChange={handleChange} />

        <input name="search" placeholder="Search..." onChange={handleChange} />

        <button onClick={handleDownload} className="btn primary full">
          {loading ? "Downloading..." : "Download Excel"}
        </button>
      </div>
    </div>
  );
}

export default StudentExportExcel;