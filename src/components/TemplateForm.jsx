import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TemplateForm({ editingTemplate, setEditingTemplate, setTemplates }) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name || '');
      setContent(editingTemplate.content || '');
    } else {
      setName('');
      setContent('');
    }
  }, [editingTemplate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingTemplate ? 'PUT' : 'POST';
    const url = editingTemplate && editingTemplate.id
      ? `${API_BASE_URL}/${editingTemplate.id}`
      : `${API_BASE_URL}`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((newTemplate) => {
        setTemplates((prev) => {
          if (editingTemplate) {
            return prev.map((template) =>
              template.id === newTemplate.id ? newTemplate : template
            );
          } else {
            return [...prev, newTemplate];
          }
        });
        setEditingTemplate(null);
        setName('');
        setContent('');
      })
      .catch((error) => console.error('Error saving template:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter template name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter template content"
          rows="4"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        {editingTemplate ? 'Update Template' : 'Create Template'}
      </button>
    </form>
  );
}

export default TemplateForm;
