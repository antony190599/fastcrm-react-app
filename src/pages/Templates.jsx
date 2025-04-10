import { useState, useEffect } from 'react';
import TemplateForm from '../components/TemplateForm';

const API_BASE_URL = import.meta.env.API_BASE_URL;

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch templates from API
  useEffect(() => {
    fetch(`${API_BASE_URL}?q=${searchQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        return response.json();
      })
      .then((data) => setTemplates(data))
      .catch((error) => console.error('Error fetching templates:', error));
  }, [searchQuery]);

  const handleDelete = (_id) => {
    fetch(`${API_BASE_URL}/${_id}`, { method: 'DELETE' })
      .then(() => setTemplates((prev) => prev.filter((template) => template._id !== _id)))
      .catch((error) => console.error('Error deleting template:', error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6 mx-auto max-w-7xl bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Templates</h1>
      <input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
      />
      <TemplateForm
        editingTemplate={editingTemplate}
        setEditingTemplate={setEditingTemplate}
        setTemplates={setTemplates}
      />
      <ul className="mt-8 space-y-6">
        {templates.map((template) => (
          <li key={template._id} className="p-6 bg-white rounded-lg shadow-md">
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
                onClick={() => handleDelete(template._id)}
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