// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

// Templates
import TemplateList from './components/templates/TemplateList';
import TemplateForm from './components/templates/TemplateForm';

// Companies
import CompanyList from './components/companies/CompanyList';
import CompanyForm from './components/companies/CompanyForm';

// Contacts
import ContactList from './components/contacts/ContactList';
import ContactForm from './components/contacts/ContactForm';
import ContactDetail from './components/contacts/ContactDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/contacts" replace />} />
            
            {/* Templates routes */}
            <Route path="/templates" element={<TemplateList />} />
            <Route path="/templates/new" element={<TemplateForm isEditing={false} />} />
            <Route path="/templates/edit/:id" element={<TemplateForm isEditing={true} />} />
            
            {/* Companies routes */}
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/new" element={<CompanyForm isEditing={false} />} />
            <Route path="/companies/edit/:id" element={<CompanyForm isEditing={true} />} />
            
            {/* Contacts routes */}
            <Route path="/contacts" element={<ContactList />} />
            <Route path="/contacts/new" element={<ContactForm isEditing={false} />} />
            <Route path="/contacts/edit/:id" element={<ContactForm isEditing={true} />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;