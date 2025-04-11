// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import TemplateList from './components/templates/TemplateList';
import TemplateForm from './components/templates/TemplateForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/templates" replace />} />
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/templates/new" element={<TemplateForm isEditing={false} />} />
            <Route path="/templates/edit/:id" element={<TemplateForm isEditing={true} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;