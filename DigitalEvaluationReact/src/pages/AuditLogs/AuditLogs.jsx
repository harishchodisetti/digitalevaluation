import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {

  fetchPagedAuditLogs

} from "../../services/auditLogService";

import "./AuditLogs.css";

function AuditLogs() {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);

  const [filters, setFilters] = useState({

    userName: "",

    action: "",

    entityName: "",

    fromDate: "",

    toDate: "",

    pageNumber: 1,

    pageSize: 10
  });

  // ================= LOAD =================

  const loadLogs = async () => {

    try {

      setLoading(true);

      const data = await fetchPagedAuditLogs({

        userName: filters.userName || null,

        action: filters.action || null,

        entityName: filters.entityName || null,

        fromDate: filters.fromDate || null,

        toDate: filters.toDate || null,

        pageNumber: filters.pageNumber,

        pageSize: Number(filters.pageSize)
      });

      setLogs(data.data || []);

      setTotalRecords(data.totalRecords || 0);

    } catch {

      toast.error("Failed to load audit logs ❌");

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

    <div className="audit-container">

      <h2 className="title">

        🛡 Audit Logs

      </h2>

      {/* FILTERS */}

      <div className="filter-grid">

        {/* USER */}

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={filters.userName}
          onChange={handleChange}
        />

        {/* ACTION */}

        <select
          name="action"
          value={filters.action}
          onChange={handleChange}
        >

          <option value="">
            All Actions
          </option>

          <option value="Create">
            Create
          </option>

          <option value="Update">
            Update
          </option>

          <option value="Delete">
            Delete
          </option>

        </select>

        {/* ENTITY */}

        <select
          name="entityName"
          value={filters.entityName}
          onChange={handleChange}
        >

          <option value="">
            All Entities
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

        </select>

        {/* FROM */}

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />

        {/* TO */}

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

      {/* TOTAL */}

      <p className="total">

        Total Records: {totalRecords}

      </p>

      {/* TABLE */}

      <div className="table-wrapper">

        {loading ? (

          <p className="loading">

            Loading...

          </p>

        ) : (

          <table className="audit-table">

            <thead>

              <tr>

                <th>User</th>

                <th>Action</th>

                <th>Entity</th>

                <th>Record ID</th>

                <th>Module</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              {logs.length === 0 ? (

                <tr>

                  <td colSpan="6">

                    No Audit Logs Found

                  </td>

                </tr>

              ) : (

                logs.map((log) => (

                  <tr key={log.auditLogId}>

                    <td>
                      {log.userName}
                    </td>

                    <td>
                      {log.action}
                    </td>

                    <td>
                      {log.entityName}
                    </td>

                    <td>
                      {log.recordId}
                    </td>

                    <td>
                      {log.module}
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

      {/* PAGINATION */}

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

export default AuditLogs;