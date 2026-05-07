import React, { useEffect, useState } from "react";
import {
  fetchMarks,
  fetchMarkById,
  addMark,
  editMark,
  removeMark,
} from "../../services/revaluationMarkService";
import "./RevaluationMarks.css";

const RevaluationMarks = () => {
  const [marks, setMarks] = useState([]);
  const [formData, setFormData] = useState({
    revaluationDetailId: "",
    questionId: "",
    oldMarks: "",
    newMarks: "",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      const data = await fetchMarks({ pageNumber: 1, pageSize: 10 });
      setMarks(data.data); // backend returns { Data, TotalCount }
    } catch (err) {
      console.error("Error fetching marks:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMark(formData);
    setFormData({
      revaluationDetailId: "",
      questionId: "",
      oldMarks: "",
      newMarks: "",
    });
    loadMarks();
  };

  const handleDelete = async (id) => {
    await removeMark(id);
    loadMarks();
  };

  const handleEdit = (record) => {
    setEditId(record.id);
    setEditData({ ...record });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    await editMark(editData);
    setEditId(null);
    setEditData({});
    loadMarks();
  };

  return (
    <div className="marks-container">
      <h1 className="page-title">Revaluation Marks</h1>

      {/* Form on Top */}
      <div className="card form-card">
        <h2 className="section-title">Add New Mark</h2>
        <form onSubmit={handleSubmit} className="marks-form">
          <input
            type="number"
            placeholder="Revaluation Detail Id"
            value={formData.revaluationDetailId}
            onChange={(e) =>
              setFormData({ ...formData, revaluationDetailId: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Question Id"
            value={formData.questionId}
            onChange={(e) =>
              setFormData({ ...formData, questionId: e.target.value })
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
          <button type="submit" className="btn btn-primary">
            Add Mark
          </button>
        </form>
      </div>

      {/* Table Below */}
      <div className="card">
        <h2 className="section-title">Existing Marks</h2>
        <div className="table-wrapper">
          <table className="marks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Detail Id</th>
                <th>Question Id</th>
                <th>Question</th>
                <th>Old Marks</th>
                <th>New Marks</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => (
                <tr key={m.id}>
                  {editId === m.id ? (
                    <>
                      <td>{m.id}</td>
                      <td>{m.revaluationDetailId}</td>
                      <td>{m.questionId}</td>
                      <td>{m.questionText}</td>
                      <td>
                        <input
                          type="number"
                          value={editData.oldMarks || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, oldMarks: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.newMarks || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, newMarks: e.target.value })
                          }
                        />
                      </td>
                      <td>{m.createdDate}</td>
                      <td>
                        <button className="btn btn-primary" onClick={handleSaveEdit}>
                          Save
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{m.id}</td>
                      <td>{m.revaluationDetailId}</td>
                      <td>{m.questionId}</td>
                      <td>{m.questionText}</td>
                      <td>{m.oldMarks}</td>
                      <td>{m.newMarks}</td>
                      <td>{m.createdDate}</td>
                      <td>
                        <button className="btn btn-secondary" onClick={() => handleEdit(m)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(m.id)}>
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

export default RevaluationMarks;
