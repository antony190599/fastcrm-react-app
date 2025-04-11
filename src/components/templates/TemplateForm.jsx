
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import templateService from '../../services/templateService';

const TemplateForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: 'seguimiento',
    content: '',
    author: '',
    labels: []
  });
  
  const [labelInput, setLabelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditing && id) {
      fetchTemplate();
    }
  }, [isEditing, id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const template = await templateService.getTemplateById(id);
      setFormData({
        type: template.type || 'seguimiento',
        content: template.content || '',
        author: template.author || '',
        labels: template.labels || []
      });
    } catch (err) {
      setError(err.message || 'Error al cargar la plantilla');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLabelInputChange = (e) => {
    setLabelInput(e.target.value);
  };

  const addLabel = () => {
    if (labelInput.trim()) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelInput.trim()]
      }));
      setLabelInput('');
    }
  };

  const removeLabel = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await templateService.updateTemplate(id, formData);
        setSuccess('Plantilla actualizada correctamente');
      } else {
        await templateService.createTemplate(formData);
        setSuccess('Plantilla creada correctamente');
        // Limpiar el formulario después de crear
        setFormData({
          type: 'seguimiento',
          content: '',
          author: '',
          labels: []
        });
      }
      
      // Redireccionar después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/templates');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Error al guardar la plantilla');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Plantilla' : 'Nueva Plantilla'}
        </h1>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white shadow rounded-lg p-6">
        {loading && !isEditing ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                Tipo *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="seguimiento">Seguimiento</option>
                <option value="bienvenida">Bienvenida</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
                Contenido *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Escribe el contenido de la plantilla..."
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">
                Autor *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Nombre del autor"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={labelInput}
                  onChange={handleLabelInputChange}
                  className="flex-grow border border-gray-300 rounded-l px-3 py-2"
                  placeholder="Añadir etiqueta..."
                />
                <button
                  type="button"
                  onClick={addLabel}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r"
                >
                  Añadir
                </button>
              </div>
              
              {formData.labels.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.labels.map((label, index) => (
                    <div key={index} className="bg-gray-100 flex items-center px-3 py-1 rounded">
                      <span className="text-sm text-gray-700">{label}</span>
                      <button
                        type="button" 
                        onClick={() => removeLabel(index)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : (
                  isEditing ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TemplateForm;