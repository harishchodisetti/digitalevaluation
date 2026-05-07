import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchPagedLogs
} from "../../services/activityLogService";

import "./ActivityLogs.css";

function ActivityLogs() {

  const [logs, setLogs] = useState([]);

  const [filters, setFilters] = useState({
    userName: "",
    activityType: "",
    module: "",
    fromDate: "",
    toDate: "",
    pageNumber: 1,
    pageSize: 10
  });

  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);

  // ================= LOAD LOGS =================

  const loadLogs = async () => {

    try {

      setLoading(true);

      const data = await fetchPagedLogs({

        userName: filters.userName || null,

        activityType: filters.activityType || null,

        module: filters.module || null,

        fromDate: filters.fromDate || null,

        toDate: filters.toDate || null,

        pageNumber: filters.pageNumber,

        pageSize: Number(filters.pageSize)
      });

      setLogs(data.data || []);

      setTotalRecords(data.totalRecords || 0);

    } catch {

      toast.error("Failed to load activity logs ❌");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadLogs();

  }, [filters.pageNumber]);

  // ================= INPUT =================

  const handleChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // ================= PAGINATION =================

  const nextPage = () => {

    if (logs.length < filters.pageSize) return;

    setFilters({
      ...filters,
      pageNumber: filters.pageNumber + 1
    });
  };

  const prevPage = () => {

    if (filters.pageNumber === 1) return;

    setFilters({
      ...filters,
      pageNumber: filters.pageNumber - 1
    });
  };

  return (

    <div className="activity-container">

      <h2 className="title">
        📋 Activity Logs
      </h2>

      {/* ================= FILTERS ================= */}

      <div className="filter-grid">

        {/* USER NAME */}

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={filters.userName}
          onChange={handleChange}
        />

        {/* ACTIVITY TYPE */}

        <select
          name="activityType"
          value={filters.activityType}
          onChange={handleChange}
        >
          <option value="">
            All Activity Types
          </option>

          <option value="Login">
            Login
          </option>

          <option value="Logout">
            Logout
          </option>

          <option value="Create">
            Create
          </option>

          <option value="View">
            View
          </option>

          <option value="Update">
            Update
          </option>

          <option value="Delete">
            Delete
          </option>

        </select>

        {/* MODULE */}

        <select
          name="module"
          value={filters.module}
          onChange={handleChange}
        >

          <option value="">
            All Modules
          </option>

          <option value="Student">
            Student
          </option>

          <option value="Faculty">
            Faculty
          </option>

          <option value="Exam">
            Exam
          </option>

          <option value="Question">
            Question
          </option>

          <option value="Evaluation">
            Evaluation
          </option>

          <option value="Report">
            Report
          </option>

        </select>

        {/* FROM DATE */}

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />

        {/* TO DATE */}

        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
        />

        {/* PAGE SIZE */}

        <select
          name="pageSize"
          value={filters.pageSize}
          onChange={handleChange}
        >
          <option value="5">5</option>

          <option value="10">10</option>

          <option value="20">20</option>

          <option value="50">50</option>
        </select>

        {/* BUTTON */}

        <button
          className="btn-main"
          onClick={loadLogs}
        >
          Get Logs
        </button>

      </div>

      {/* ================= TOTAL ================= */}

      <p className="total">

        Total Records: {totalRecords}

      </p>

      {/* ================= TABLE ================= */}

      <div className="table-wrapper">

        {loading ? (

          <p className="loading">
            Loading...
          </p>

        ) : (

          <table className="activity-table">

            <thead>

              <tr>

                <th>User</th>

                <th>Activity</th>

                <th>Module</th>

                <th>Description</th>

                <th>Method</th>

                <th>Status</th>

                <th>Path</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              {logs.length === 0 ? (

                <tr>

                  <td colSpan="8">

                    No Logs Found

                  </td>

                </tr>

              ) : (

                logs.map((log) => (

                  <tr key={log.activityLogId}>

                    <td>
                      {log.userName}
                    </td>

                    <td>
                      {log.activityType}
                    </td>

                    <td>
                      {log.module}
                    </td>

                    <td>
                      {log.description}
                    </td>

                    <td>
                      {log.method}
                    </td>

                    <td>
                      {log.statusCode}
                    </td>

                    <td>
                      {log.path}
                    </td>

                    <td>

                      {new Date(log.createdDate)
                        .toLocaleString()}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        )}

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="pagination">

        <button
          onClick={prevPage}
          disabled={filters.pageNumber === 1}
        >
          Prev
        </button>

        <span>
          Page {filters.pageNumber}
        </span>

        <button
          onClick={nextPage}
          disabled={logs.length < filters.pageSize}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default ActivityLogs;