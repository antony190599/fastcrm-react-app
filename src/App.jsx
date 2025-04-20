// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Templates
import TemplateList from './components/templates/TemplateList';
import TemplateForm from './components/templates/TemplateForm';
import MessageForm from './components/templates/MessageForm';

// Companies
import CompanyList from './components/companies/CompanyList';
import CompanyForm from './components/companies/CompanyForm';
import CompanyDetail from './components/companies/CompanyDetail';

// Contacts
import ContactList from './components/contacts/ContactList';
import ContactForm from './components/contacts/ContactForm';
import ContactDetail from './components/contacts/ContactDetail';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Templates routes */}
          <Route path="/templates" element={<TemplateList />} />
          <Route path="/templates/new" element={<TemplateForm isEditing={false} />} />
          <Route path="/templates/edit/:id" element={<TemplateForm isEditing={true} />} />
          <Route path="/templates/send" element={<MessageForm />} />
          <Route path="/templates/send/:contactId" element={<MessageForm />} />
          
          {/* Companies routes */}
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/new" element={<CompanyForm isEditing={false} />} />
          <Route path="/companies/edit/:id" element={<CompanyForm isEditing={true} />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          
          {/* Contacts routes */}
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/contacts/new" element={<ContactForm isEditing={false} />} />
          <Route path="/contacts/edit/:id" element={<ContactForm isEditing={true} />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;