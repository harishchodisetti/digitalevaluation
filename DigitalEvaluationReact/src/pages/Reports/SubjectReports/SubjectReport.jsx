// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { fetchSubjectReport } from "../../services/subjectReportService";
// import "./SubjectReport.css";

// function SubjectReport() {
//   const [filters, setFilters] = useState({
//     examId: "",
//     pageNumber: 1,
//     pageSize: 10,
//   });

//   const [data, setData] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // 🔥 Load report
//   const loadReport = async () => {
//     try {
//       setLoading(true);

//       const res = await fetchSubjectReport({
//         examId: filters.examId || null,
//         pageNumber: filters.pageNumber,
//         pageSize: filters.pageSize,
//       });

//       setData(res.data || []);
//       setTotalRecords(res.totalRecords || 0);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load subject report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load when page changes
//   useEffect(() => {
//     loadReport();
//   }, [filters.pageNumber]);

//   // Handle input
//   const handleChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   // Pagination
//   const nextPage = () => {
//     if (data.length < filters.pageSize) return;
//     setFilters({ ...filters, pageNumber: filters.pageNumber + 1 });
//   };

//   const prevPage = () => {
//     if (filters.pageNumber === 1) return;
//     setFilters({ ...filters, pageNumber: filters.pageNumber - 1 });
//   };

//   return (
//     <div className="subject-report-container">
//       <h2 className="title">📘 Subject Report</h2>

//       {/* 🔍 Filters */}
//       <div className="filters">
//         <input
//           type="number"
//           name="examId"
//           placeholder="Enter Exam ID"
//           value={filters.examId}
//           onChange={handleChange}
//         />

//         <button onClick={loadReport} className="btn primary">
//           Get Report
//         </button>
//       </div>

//       {/* 📊 Table */}
//       <div className="table-wrapper">
//         {loading ? (
//           <p className="loading">Loading...</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Subject Name</th>
//                 <th>Average Marks</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data.length === 0 ? (
//                 <tr>
//                   <td colSpan="2" className="no-data">
//                     No Data Found
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.subjectName}</td>
//                     <td>{item.averageMarks}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* 🔄 Pagination */}
//       <div className="pagination">
//         <button
//           onClick={prevPage}
//           disabled={filters.pageNumber === 1}
//           className="btn"
//         >
//           Prev
//         </button>

//         <span>Page {filters.pageNumber}</span>

//         <button
//           onClick={nextPage}
//           disabled={data.length < filters.pageSize}
//           className="btn"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default SubjectReport;





import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchSubjectReport } from "../../../services/reports/subjectReportService";
import "./SubjectReport.css";

function SubjectReport() {
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
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 Load report
  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await fetchSubjectReport({
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

      setData(res.data || []);
      setTotalRecords(res.totalRecords || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subject report");
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
    <div className="subject-report-container">
      <h2 className="title">📘 Subject Report</h2>

      {/* 🔍 FILTERS */}
      <div className="filters grid">
        <input name="studentId" placeholder="Student ID" value={filters.studentId} onChange={handleChange} />
        <input name="examId" placeholder="Exam ID" value={filters.examId} onChange={handleChange} />
        <input name="subjectId" placeholder="Subject ID" value={filters.subjectId} onChange={handleChange} />
        <input name="evaluatorId" placeholder="Evaluator ID" value={filters.evaluatorId} onChange={handleChange} />

        <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} />
        <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} />

        <input name="search" placeholder="Search..." value={filters.search} onChange={handleChange} />

        <button onClick={loadReport} className="btn primary">
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
                <th>Subject Name</th>
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
                    <td>{item.subjectName}</td>
                    <td>{item.averageMarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔄 PAGINATION */}
      <div className="pagination">
        <button onClick={prevPage} disabled={filters.pageNumber === 1} className="btn">
          Prev
        </button>

        <span>Page {filters.pageNumber}</span>

        <button onClick={nextPage} disabled={data.length < filters.pageSize} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}

export default SubjectReport;