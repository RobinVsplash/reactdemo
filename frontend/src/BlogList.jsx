import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';

const API_BASE = 'http://localhost:3000/api/v1/blog';
const UPLOADS_BASE = 'http://localhost:3000/uploads/';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => { fetchBlogs(); }, []);

  return (
    <div className="blog-page">
      <h1>All Blogs</h1>
      <div className="blog-list">
        {loading ? <div>Loading...</div> : blogs.length === 0 ? <div>No blogs found.</div> : blogs.map((blog) => {
          const bgUrl = blog.imageUrl ? (blog.imageUrl.startsWith('http') ? blog.imageUrl : UPLOADS_BASE + blog.imageUrl.replace('/uploads/', '')) : '';
          return (
            <div className="blog-card" key={blog._id} onClick={() => navigate(`/blogs/${blog._id}`)} style={{cursor:'pointer'}}>
              {bgUrl && <div className="blog-bg" style={{ backgroundImage: `url('${bgUrl}')` }}></div>}
              <div className="blog-content">
                {blog.author && <span className="blog-category">{blog.author}</span>}
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
