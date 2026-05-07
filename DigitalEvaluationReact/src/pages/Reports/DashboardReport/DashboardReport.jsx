import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchDashboardReport } from "../../../services/reports/dashboardReportService";
import "./DashboardReport.css";

function DashboardReport() {
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

  // 🔥 LOAD REPORT
  const loadReport = async () => {
    try {
      setLoading(true);

      const result = await fetchDashboardReport({
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

      console.log("Dashboard Report:", result);

      setData(result); // ✅ object
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="dashboard-report-container">
      <h2 className="title">📊 Dashboard Report</h2>

      {/* 🔍 FILTERS */}
      <div className="filters-grid">
        <input name="studentId" placeholder="Student ID" onChange={handleChange} />
        <input name="examId" placeholder="Exam ID" onChange={handleChange} />
        <input name="subjectId" placeholder="Subject ID" onChange={handleChange} />
        <input name="evaluatorId" placeholder="Evaluator ID" onChange={handleChange} />

        <input type="date" name="fromDate" onChange={handleChange} />
        <input type="date" name="toDate" onChange={handleChange} />

        <input name="search" placeholder="Search..." onChange={handleChange} />

        <button onClick={loadReport} className="btn primary full">
          Get Report
        </button>
      </div>

      {/* 📊 RESULT */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : data ? (
        <div className="cards">
          <div className="card">
            <h3>Total Students</h3>
            <p>{data.totalStudents}</p>
          </div>

          <div className="card">
            <h3>Total Exams</h3>
            <p>{data.totalExams}</p>
          </div>

          <div className="card">
            <h3>Pass Percentage</h3>
            <p>{data.passPercentage}%</p>
          </div>
        </div>
      ) : (
        <p className="no-data">No Data Found</p>
      )}
    </div>
  );
}

export default DashboardReport;