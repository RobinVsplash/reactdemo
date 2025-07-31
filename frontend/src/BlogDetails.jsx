import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Blog.css';

const API_BASE = 'http://localhost:3000/api/v1/blog';
const UPLOADS_BASE = 'http://localhost:3000/uploads/';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        const data = await res.json();
        if (data.status === 'success') setBlog(data.data);
        else setError(data.message || 'Blog not found');
      } catch (err) {
        setError('Failed to fetch blog');
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="blog-page"><div>Loading...</div></div>;
  if (error) return <div className="blog-page"><div className="error">{error}</div></div>;
  if (!blog) return null;

  const bgUrl = blog.imageUrl ? (blog.imageUrl.startsWith('http') ? blog.imageUrl : UPLOADS_BASE + blog.imageUrl.replace('/uploads/', '')) : '';

  return (
    <div className="blog-page">
      <button style={{marginBottom:20}} onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="blog-details-card">
        {bgUrl && <div className="blog-details-bg" style={{ backgroundImage: `url('${bgUrl}')` }}></div>}
        <div className="blog-details-content">
          {blog.author && <span className="blog-category">{blog.author}</span>}
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </div>
      </div>
    </div>
  );
}
