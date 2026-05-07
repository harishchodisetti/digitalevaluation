import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchColleges,
  createCollege,
  updateCollege,
  removeCollege
} from "../../services/collegeService";

import "./Colleges.css";

function Colleges() {

  const [colleges, setColleges] = useState([]);

  const [editId, setEditId] = useState(null);

  const [editForm, setEditForm] = useState({});

  const [search, setSearch] = useState("");

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    collegeCode: "",
    collegeName: "",
    city: "",
    state: "",
    country: ""
  });

  // ================= PAGINATION =================

  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  // ================= LOAD =================

  const loadColleges = async () => {

    try {

      const data = await fetchColleges();

      setColleges(data || []);

    } catch (err) {

      console.error(err);

      toast.error("Failed to load colleges ❌");
    }
  };

  useEffect(() => {

    loadColleges();

  }, []);

  // ================= FILTER =================

  const filteredData = colleges.filter((c) => {

    const val = search.toLowerCase();

    return (
      c.collegeName?.toLowerCase().includes(val) ||
      c.collegeCode?.toLowerCase().includes(val) ||
      c.city?.toLowerCase().includes(val)
    );
  });

  // ================= PAGINATION =================

  const indexOfLast = currentPage * recordsPerPage;

  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );

  // ================= VALIDATION =================

  const validate = () => {

    let newErrors = {};

    if (!form.collegeCode.trim())
      newErrors.collegeCode = "College Code is required";

    if (!form.collegeName.trim())
      newErrors.collegeName = "College Name is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= INPUT =================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors((prev) => {

      const copy = { ...prev };

      delete copy[e.target.name];

      return copy;
    });
  };

  // ================= ADD =================

  const handleAdd = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    const toastId = toast.loading("Adding college...");

    try {

      await createCollege(form);

      toast.success("College Added Successfully ✅", {
        id: toastId
      });

      loadColleges();

      resetForm();

    } catch {

      toast.error("Add failed ❌", {
        id: toastId
      });
    }
  };

  // ================= EDIT =================

  const handleEdit = (college) => {

    setEditId(college.collegeId);

    setEditForm({
      collegeCode: college.collegeCode || "",
      collegeName: college.collegeName || "",
      city: college.city || "",
      state: college.state || "",
      country: college.country || ""
    });
  };

  const handleEditChange = (e) => {

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE =================

  const handleUpdate = async () => {

    const toastId = toast.loading("Updating college...");

    try {

      await updateCollege(editId, {
        collegeCode: editForm.collegeCode,
        collegeName: editForm.collegeName,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country
      });

      toast.success("Updated Successfully ✅", {
        id: toastId
      });

      setEditId(null);

      loadColleges();

    } catch (err) {

      console.error(err);

      toast.error("Update failed ❌", {
        id: toastId
      });
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this college?"))
      return;

    const toastId = toast.loading("Deleting college...");

    try {

      await removeCollege(id);

      toast.success("Deleted Successfully 🗑️", {
        id: toastId
      });

      loadColleges();

    } catch {

      toast.error("Delete failed ❌", {
        id: toastId
      });
    }
  };

  // ================= RESET =================

  const resetForm = () => {

    setForm({
      collegeCode: "",
      collegeName: "",
      city: "",
      state: "",
      country: ""
    });

    setErrors({});
  };

  return (

    <div className="college-container">

      <h2 className="title">
        🏫 College Management
      </h2>

      {/* ================= FORM ================= */}

      <form className="college-card" onSubmit={handleAdd}>

        <label>College Code</label>

        <input
          type="text"
          name="collegeCode"
          value={form.collegeCode}
          onChange={handleChange}
          className={errors.collegeCode ? "input-error" : ""}
        />

        {errors.collegeCode && (
          <p className="error">
            {errors.collegeCode}
          </p>
        )}

        <label>College Name</label>

        <input
          type="text"
          name="collegeName"
          value={form.collegeName}
          onChange={handleChange}
          className={errors.collegeName ? "input-error" : ""}
        />

        {errors.collegeName && (
          <p className="error">
            {errors.collegeName}
          </p>
        )}

        <label>City</label>

        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
        />

        <label>State</label>

        <input
          type="text"
          name="state"
          value={form.state}
          onChange={handleChange}
        />

        <label>Country</label>

        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
        />

        <button type="submit" className="btn add-btn">
          Add College
        </button>

      </form>

      {/* ================= TABLE ================= */}

      <div className="table-container">

        <div className="table-header">

          <input
            className="search-box"
            placeholder="Search by code / name / city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

        </div>

        <table className="college-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {currentRecords.length === 0 ? (

              <tr>
                <td colSpan="7" className="no-data">
                  No Colleges Found
                </td>
              </tr>

            ) : (

              currentRecords.map((c) =>

                editId === c.collegeId ? (

                  <tr key={c.collegeId} className="edit-row">

                    <td>{c.collegeId}</td>

                    <td>
                      <input
                        name="collegeCode"
                        value={editForm.collegeCode || ""}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="collegeName"
                        value={editForm.collegeName || ""}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="city"
                        value={editForm.city || ""}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="state"
                        value={editForm.state || ""}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="country"
                        value={editForm.country || ""}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td className="action-buttons">

                      <button
                        type="button"
                        className="btn save-btn"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="btn cancel-btn"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>

                    </td>

                  </tr>

                ) : (

                  <tr key={c.collegeId}>

                    <td>{c.collegeId}</td>

                    <td>{c.collegeCode}</td>

                    <td>{c.collegeName}</td>

                    <td>{c.city || "-"}</td>

                    <td>{c.state || "-"}</td>

                    <td>{c.country || "-"}</td>

                    <td className="action-buttons">

                      <button
                        type="button"
                        className="btn edit-btn"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn delete-btn"
                        onClick={() => handleDelete(c.collegeId)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )
            )}

          </tbody>

        </table>

        {/* ================= PAGINATION ================= */}

        <div className="pagination">

          <button
            className="btn page-btn"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            Prev
          </button>

          <span className="page-text">
            Page {currentPage}
          </span>

          <button
            className="btn page-btn"
            disabled={indexOfLast >= filteredData.length}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default Colleges;