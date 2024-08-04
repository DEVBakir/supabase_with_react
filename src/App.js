import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import ProductPage from "./components/ProductPage";
import BlogPage from "./components/BlogPage";
import ArticleDetailPage from "./components/ArticleDetailPage";
import BlogManagementPage from "./components/BlogManagment";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/products" element={<ProductPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<ArticleDetailPage />} />
        <Route path="/blog/manage" element={<BlogManagementPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
