import React, { useEffect, useState } from "react";
import {
  fetchDetails,
  fetchDetailById,
  addDetail,
  removeDetail,
} from "../../services/revaluationDetailService";
import "./RevaluationDetails.css";

const RevaluationDetails = () => {
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    revaluationRequestId: "",
    facultyId: "",
    oldMarks: "",
    newMarks: "",
    remarks: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const data = await fetchDetails({ pageNumber: 1, pageSize: 10 });
      setDetails(data.items);
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDetail(formData);
      setFormData({
        revaluationRequestId: "",
        facultyId: "",
        oldMarks: "",
        newMarks: "",
        remarks: "",
      });
      loadDetails();
    } catch (err) {
      console.error("Error adding detail:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeDetail(id);
      loadDetails();
    } catch (err) {
      console.error("Error deleting detail:", err);
    }
  };

  const handleEdit = (record) => {
    setEditId(record.revaluationDetailId);
    setEditData({ ...record });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    try {
      await addDetail(editData); // placeholder until backend PUT is added
      setEditId(null);
      setEditData({});
      loadDetails();
    } catch (err) {
      console.error("Error saving edit:", err);
    }
  };

  return (
    <div className="reval-container">
      <h1 className="page-title">Revaluation Details</h1>

      {/* Form Card on Top */}
      <div className="card form-card">
        <h2 className="section-title">Add New Detail</h2>
        <form onSubmit={handleSubmit} className="reval-form">
          <input
            type="number"
            placeholder="Revaluation Request Id"
            value={formData.revaluationRequestId}
            onChange={(e) =>
              setFormData({ ...formData, revaluationRequestId: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Faculty Id"
            value={formData.facultyId}
            onChange={(e) =>
              setFormData({ ...formData, facultyId: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Old Marks"
            value={formData.oldMarks}
            onChange={(e) =>
              setFormData({ ...formData, oldMarks: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="New Marks"
            value={formData.newMarks}
            onChange={(e) =>
              setFormData({ ...formData, newMarks: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
          />
          <button type="submit" className="btn btn-primary">
            Add Detail
          </button>
        </form>
      </div>

      {/* Table Card Below */}
      <div className="card">
        <h2 className="section-title">Existing Records</h2>
        <div className="table-wrapper">
          <table className="reval-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Request</th>
                <th>Faculty</th>
                <th>Old Marks</th>
                <th>New Marks</th>
                <th>Evaluated Date</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d) => (
                <tr key={d.revaluationDetailId}>
                  {editId === d.revaluationDetailId ? (
                    <>
                      <td>{d.revaluationDetailId}</td>
                      <td>
                        <input
                          type="number"
                          value={editData.revaluationRequestId || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              revaluationRequestId: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.facultyId || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              facultyId: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.oldMarks || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              oldMarks: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.newMarks || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              newMarks: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>{editData.evaluatedDate}</td>
                      <td>
                        <input
                          type="text"
                          value={editData.remarks || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              remarks: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{d.revaluationDetailId}</td>
                      <td>{d.revaluationRequestId}</td>
                      <td>{d.facultyId}</td>
                      <td>{d.oldMarks}</td>
                      <td>{d.newMarks}</td>
                      <td>{d.evaluatedDate}</td>
                      <td>{d.remarks}</td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(d.revaluationDetailId)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevaluationDetails;
