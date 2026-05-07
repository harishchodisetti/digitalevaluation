import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchRevaluationReport } from "../../../services/reports/revaluationReportService";
import "./RevaluationReport.css";

function RevaluationReport() {
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

  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await fetchRevaluationReport({
        studentId: filters.studentId || null,
        examId: filters.examId || null,
        subjectId: filters.subjectId || null,
        evaluatorId: filters.evaluatorId || null,
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null,
        search: filters.search || "",
        pageNumber: filters.pageNumber,
        pageSize: filters.pageSize,
      });

      // Expecting array OR {data: []}
      setData(res.data || res || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load revaluation report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [filters.pageNumber]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const nextPage = () => {
    if (data.length < filters.pageSize) return;
    setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
  };

  const prevPage = () => {
    if (filters.pageNumber === 1) return;
    setFilters({ ...filters, pageNumber: filters.pageNumber - 1 });
  };

  return (
    <div className="reval-container">
      <h2 className="title">📄 Revaluation Report</h2>

      {/* Filters */}
      <div className="filters">
        <input name="studentId" placeholder="Student ID" onChange={handleChange} />
        <input name="examId" placeholder="Exam ID" onChange={handleChange} />
        <input name="subjectId" placeholder="Subject ID" onChange={handleChange} />
        <input name="evaluatorId" placeholder="Evaluator ID" onChange={handleChange} />

        <input type="date" name="fromDate" onChange={handleChange} />
        <input type="date" name="toDate" onChange={handleChange} />

        <input name="search" placeholder="Search student..." onChange={handleChange} />

        <button onClick={loadReport} className="btn primary">
          Get Report
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
               
                <th>Old Marks</th>
                <th>New Marks</th>
                
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No Data Found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                   
                    <td>{item.studentId}</td>   
                   
                    <td>{item.oldMarks}</td>
                    <td>{item.newMarks}</td>
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={prevPage} disabled={filters.pageNumber === 1}>
          Prev
        </button>

        <span>Page {filters.pageNumber}</span>

        <button onClick={nextPage} disabled={data.length < filters.pageSize}>
          Next
        </button>
      </div>
    </div>
  );
}

export default RevaluationReport;