import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import templateService from '../../services/templateService';
import * as yup from 'yup';

// Define validation schema
const validationSchema = yup.object().shape({
  type: yup.string().required('El tipo es requerido'),
  content: yup
    .string()
    .required('El contenido es requerido')
    .min(10, 'El contenido debe tener al menos 10 caracteres'),
  author: yup
    .string()
    .required('El autor es requerido')
    .min(3, 'El nombre del autor debe tener al menos 3 caracteres'),
  labels: yup.array().of(yup.string()).min(1, 'Se requiere al menos una etiqueta')
});

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
  const [validationErrors, setValidationErrors] = useState({});

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
        type: template.data.type || 'seguimiento',
        content: template.data.content || '',
        author: template.data.author || '',
        labels: template.data.labels || []
      });
    } catch (err) {
      setError(err.message || 'Error al cargar la plantilla');
    } finally {
      setLoading(false);
    }
  };

  const validateField = async (name, value) => {
    try {
      await yup.reach(validationSchema, name).validate(value);
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (err) {
      setValidationErrors(prev => ({ ...prev, [name]: err.message }));
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    await validateField(name, value);
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

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach(e => {
        errors[e.path] = e.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await templateService.updateTemplate(id, formData);
        setSuccess('Plantilla actualizada correctamente');
      } else {
        await templateService.createTemplate(formData);
        setSuccess('Plantilla creada correctamente');
        setFormData({
          type: 'seguimiento',
          content: '',
          author: '',
          labels: []
        });
      }
      
      navigate('/templates');
      
    } catch (err) {
      setError(err.message || 'Error al guardar la plantilla');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Plantilla' : 'Nueva Plantilla'}
        </h1>
      </div>

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

      <div className="bg-white shadow rounded-lg p-6">
        {loading && !isEditing ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                Tipo *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full border ${validationErrors.type ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                required
              >
                <option value="seguimiento">Seguimiento</option>
                <option value="bienvenida">Bienvenida</option>
              </select>
              {validationErrors.type && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.type}</p>
              )}
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
                className={`w-full border ${validationErrors.content ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Escribe el contenido de la plantilla..."
                required
              ></textarea>
              {validationErrors.content && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.content}</p>
              )}
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
                className={`w-full border ${validationErrors.author ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Nombre del autor"
                required
              />
              {validationErrors.author && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.author}</p>
              )}
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
              {validationErrors.labels && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.labels}</p>
              )}
              
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