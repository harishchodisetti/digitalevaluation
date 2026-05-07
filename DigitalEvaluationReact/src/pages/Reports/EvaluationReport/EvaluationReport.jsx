import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchEvaluationReport } from "../../../services/reports/evaluationReportService";
import "./EvaluationReport.css";

function EvaluationReport() {
  const [filters, setFilters] = useState({
    studentId: "",
    examId: "",
    subjectId: "",
    evaluatorId: "",
    fromDate: "",
    toDate: "",
    search: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await fetchEvaluationReport({
        studentId: filters.studentId ? Number(filters.studentId) : null,
        examId: filters.examId ? Number(filters.examId) : null,
        subjectId: filters.subjectId ? Number(filters.subjectId) : null,
        evaluatorId: filters.evaluatorId ? Number(filters.evaluatorId) : null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        search: filters.search || "",
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize,
      });

      console.log("Evaluation Response:", res);

      setData(res); // ✅ object
    } catch (err) {
      console.error(err);
      toast.error("Failed to load evaluation report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="evaluation-container">
      <h2 className="title">📊 Evaluation Report</h2>

      {/* 🔍 FILTERS */}
      <div className="filters-grid">
        <input name="studentId" placeholder="Student ID" onChange={handleChange} />
        <input name="examId" placeholder="Exam ID" onChange={handleChange} />
        <input name="subjectId" placeholder="Subject ID" onChange={handleChange} />
        <input name="evaluatorId" placeholder="Evaluator ID" onChange={handleChange} />

        <input type="date" name="fromDate" onChange={handleChange} />
        <input type="date" name="toDate" onChange={handleChange} />

        <input name="search" placeholder="Search..." onChange={handleChange} />

        <button className="btn primary" onClick={loadReport}>
          Get Report
        </button>
      </div>

      {/* 📊 RESULT */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : data ? (
        <div className="cards">
          <div className="card">
            <h3>Total Evaluations</h3>
            <p>{data.total}</p>
          </div>

          <div className="card success">
            <h3>Completed</h3>
            <p>{data.completed}</p>
          </div>

          <div className="card warning">
            <h3>Pending</h3>
            <p>{data.pending}</p>
          </div>
        </div>
      ) : (
        <p className="no-data">No Data Found</p>
      )}
    </div>
  );
}

export default EvaluationReport;