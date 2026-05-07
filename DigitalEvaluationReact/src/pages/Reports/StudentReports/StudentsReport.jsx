import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { fetchStudentReport } from "../../../services/reports/studentReportService";
import { downloadExcel, downloadPdf } from "../../../services/reports/studentExportService";
import { downloadFile } from "../../../utils/fileDownload";

import "./StudentReport.css";

function StudentReport() {
  const [filters, setFilters] = useState({
    examId: "",
    search: "",
    pageNumber: 1,
    pageSize: 10
  });

  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const buildPayload = () => ({
    examId: filters.examId ? Number(filters.examId) : null,
    search: filters.search || "",
    pageNumber: filters.pageNumber,
    pageSize: filters.pageSize
  });

  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await fetchStudentReport(buildPayload());

      setData(res.data || []);
      setTotalRecords(res.totalRecords || 0);

    } catch {
      toast.error("Failed to load report");
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

  const handleExcel = async () => {
    const blob = await downloadExcel(buildPayload());
    downloadFile(blob, "StudentResults.xlsx");
  };

  const handlePdf = async () => {
    const blob = await downloadPdf(buildPayload());
    downloadFile(blob, "StudentResults.pdf");
  };

  return (
    <div className="report-container">
      <h2 className="title">📊 Student Report</h2>

      <div className="filters-grid">
        <input
          name="examId"
          placeholder="Exam ID"
          onChange={handleChange}
        />

        <input
          name="search"
          placeholder="Search student"
          onChange={handleChange}
        />

        <select name="pageSize" onChange={handleChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <button className="btn primary" onClick={loadReport}>
          Get Report
        </button>

        <button className="btn success" onClick={handleExcel}>
          Excel
        </button>

        <button className="btn danger" onClick={handlePdf}>
          PDF
        </button>
      </div>

      <p className="total">Total Records: {totalRecords}</p>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Total</th>
                <th>Obtained</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5">No Data</td>
                </tr>
              ) : (
                data.map((r, i) => (
                  <tr key={i}>
                    <td>{r.studentName}</td>
                    <td>{r.examId}</td>
                    <td>{r.totalMarks}</td>
                    <td>{r.obtainedMarks}</td>
                    <td>{r.percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          disabled={filters.pageNumber === 1}
          onClick={() =>
            setFilters({ ...filters, pageNumber: filters.pageNumber - 1 })
          }
        >
          Prev
        </button>

        <span>Page {filters.pageNumber}</span>

        <button
          disabled={data.length < filters.pageSize}
          onClick={() =>
            setFilters({ ...filters, pageNumber: filters.pageNumber + 1 })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StudentReport;