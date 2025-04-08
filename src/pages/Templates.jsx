import { useState, useEffect } from 'react';
import TemplateForm from '../components/TemplateForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Fetch templates from API
  useEffect(() => {
    fetch(API_BASE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        return response.json();
      })
      .then((data) => setTemplates(data))
      .catch((error) => console.error('Error fetching templates:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
      .then(() => setTemplates((prev) => prev.filter((template) => template.id !== id)))
      .catch((error) => console.error('Error deleting template:', error));
  };

  return (
    <div className="p-6 mx-auto max-w-7xl bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Templates</h1>
      <TemplateForm
        editingTemplate={editingTemplate}
        setEditingTemplate={setEditingTemplate}
        setTemplates={setTemplates}
      />
      <ul className="mt-8 space-y-6">
        {templates.map((template) => (
          <li key={template.id} className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">{template.name}</h2>
            <p className="text-gray-600 mt-2">{template.content}</p>
            <div className="mt-4 flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => setEditingTemplate(template)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={() => handleDelete(template.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Templates;