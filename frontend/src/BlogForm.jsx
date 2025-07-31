import React, { useState } from 'react';
import './Blog.css';

const API_BASE = 'http://localhost:3000/api/v1/blog';

export default function BlogForm() {
  const [form, setForm] = useState({ title: '', content: '', author: '', image: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') setForm((f) => ({ ...f, image: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('author', form.author);
    if (form.image) formData.append('image', form.image);
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('Blog created successfully!');
        setForm({ title: '', content: '', author: '', image: null });
      } else {
        setError(data.message || 'Failed to create blog');
      }
    } catch (err) {
      setError('Failed to create blog');
    }
    setLoading(false);
  };

  return (
    <div className="blog-page">
      <h1>Create Blog</h1>
      <form className="blog-form" onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
}
