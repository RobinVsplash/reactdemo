import React, { useEffect, useState } from "react";
import "./Form.css";
import Loader from "./Loader";

const API_URL = "http://localhost:3000/api/v1";

const initialForm = { name: "", email: "", age: "" };

export default function Form() {
  const [form, setForm] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/getall`);
      const data = await res.json();
      setRecords(data.data || []);
    } catch (err) {
      setError("Failed to fetch records");
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `${API_URL}/update` : `${API_URL}/add`;
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error saving record");
      setForm(initialForm);
      setEditingId(null);
      await fetchRecords();
    } catch {
      setError("Failed to save record");
    }
    setLoading(false);
  };

  const handleEdit = (rec) => {
    setForm({ name: rec.name, email: rec.email, age: rec.age });
    setEditingId(rec._id);
  };

  const handleDelete = async (id) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/delete?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchRecords();
    } catch {
      setError("Failed to delete record");
    }
    setLoading(false);
  };

  return (
    <div className="crud-container">
      {loading && <Loader />}
      <div className="crud-header">CRUD Form</div>
      <form className="crud-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Age" required type="number" min="0" />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }}>Cancel Edit</button>
        )}
      </form>
      {error && <p className="crud-error">{error}</p>}
      <h3 style={{marginTop:28, marginBottom:8, color:'#4f46e5'}}>Records</h3>
      <table className="crud-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id}>
              <td>{rec.name}</td>
              <td>{rec.email}</td>
              <td>{rec.age}</td>
              <td>
                <button className="crud-action-btn" onClick={() => handleEdit(rec)}>Edit</button>
                <button className="crud-action-btn" onClick={() => handleDelete(rec._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
