import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import BlogDetails from "./BlogDetails";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav style={{display: 'flex', gap: '24px', margin: '24px 0', justifyContent: 'center'}}>
        <Link to="/blogs">Blog List</Link>
        <Link to="/form">Form</Link>
      </nav>
      <Routes>
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/form" element={<BlogForm />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="*" element={<BlogList />} />
      </Routes>
    </Router>
  );
}

export default App;
