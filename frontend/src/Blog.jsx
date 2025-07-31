import React, { useEffect, useState } from 'react';
import './Blog.css';

const API_BASE = 'http://localhost:3000/api/v1/blog';
const UPLOADS_BASE = 'http://localhost:3000/uploads/';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', author: '', image: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data.status === 'success') setBlogs(data.data);
      else setError(data.message || 'Failed to fetch blogs');
    } catch (err) {
      setError('Failed to fetch blogs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') setForm((f) => ({ ...f, image: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  // Create or update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('author', form.author);
    if (form.image) formData.append('image', form.image);
    try {
      let res, data;
      if (editId) {
        res = await fetch(`${API_BASE}/${editId}`, {
          method: 'PATCH',
          body: formData,
        });
      } else {
        res = await fetch(API_BASE, {
          method: 'POST',
          body: formData,
        });
      }
      data = await res.json();
      if (data.status === 'success') {
        fetchBlogs();
        setForm({ title: '', content: '', author: '', image: null });
        setEditId(null);
      } else {
        setError(data.message || 'Failed to save blog');
      }
    } catch (err) {
      setError('Failed to save blog');
    }
    setLoading(false);
  };

  // Edit blog (populate form)
  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content, author: blog.author, image: null });
    setEditId(blog._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') fetchBlogs();
      else setError(data.message || 'Failed to delete blog');
    } catch (err) {
      setError('Failed to delete blog');
    }
    setLoading(false);
  };

  return (
    <div className="blog-page">
      <h1>Blog</h1>
      <form className="blog-form" onSubmit={handleSubmit}>
        <h2>{editId ? 'Edit Blog' : 'Create Blog'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>{editId ? 'Update' : 'Create'}</button>
        {editId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => { setEditId(null); setForm({ title: '', content: '', author: '', image: null }); }}
          >Cancel</button>
        )}
        {error && <div className="error">{error}</div>}
      </form>
      <div className="blog-list">
        {loading ? <div>Loading...</div> : blogs.length === 0 ? <div>No blogs found.</div> : blogs.map((blog) => {
  const bgUrl = blog.imageUrl ? (blog.imageUrl.startsWith('http') ? blog.imageUrl : UPLOADS_BASE + blog.imageUrl.replace('/uploads/', '')) : '';
  return (
    <div className="blog-card" key={blog._id}>
      {bgUrl && <div className="blog-bg" style={{ backgroundImage: `url('${bgUrl}')` }}></div>}
      <div className="blog-content">
        {blog.author && <span className="blog-category">{blog.author}</span>}
        <h3>{blog.title}</h3>
        <p>{blog.content}</p>
        <div className="blog-actions">
          <button onClick={() => handleEdit(blog)}>Edit</button>
          <button className="delete-btn" onClick={() => handleDelete(blog._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}
