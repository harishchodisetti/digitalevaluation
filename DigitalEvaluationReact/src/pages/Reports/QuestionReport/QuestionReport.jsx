import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchQuestionReport } from "../../../services/reports/questionReportService";
import "./QuestionReport.css";

function QuestionReport() {
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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD REPORT
  const loadReport = async () => {
    try {
      setLoading(true);

      const result = await fetchQuestionReport({
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

      console.log("Question Report:", result);

      setData(result || []); // ✅ IMPORTANT (array response)
    } catch (err) {
      console.error(err);
      toast.error("Failed to load question report");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 reload on page change
  useEffect(() => {
    loadReport();
  }, [filters.pageNumber]);

  // 🔄 handle input change
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // 🔄 pagination
  const nextPage = () => {
    if (data.length < filters.pageSize) return;
    setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
  };

  const prevPage = () => {
    if (filters.pageNumber === 1) return;
    setFilters({ ...filters, pageNumber: filters.pageNumber - 1 });
  };

  return (
    <div className="question-report-container">
      <h2 className="title">❓ Question Analysis Report</h2>

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

      {/* 📊 TABLE */}
      <div className="table-wrapper">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Question ID</th>
                <th>Average Marks</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="2" className="no-data">
                    No Data Found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.questionId}</td>
                    <td
                      className={
                        item.avgMarks < 3
                          ? "low"
                          : item.avgMarks < 6
                          ? "medium"
                          : "high"
                      }
                    >
                      {item.avgMarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔄 PAGINATION */}
      <div className="pagination">
        <button
          onClick={prevPage}
          disabled={filters.pageNumber === 1}
          className="btn"
        >
          Prev
        </button>

        <span>Page {filters.pageNumber}</span>

        <button
          onClick={nextPage}
          disabled={data.length < filters.pageSize}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default QuestionReport;