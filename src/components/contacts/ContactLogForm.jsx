import React, { useState } from 'react';
import * as yup from 'yup';
import contactLogService from '../../services/contactLogService';

// Esquema de validación para el formulario
const validationSchema = yup.object().shape({
  method: yup.string().required('El método es requerido'),
  notes: yup.string().required('Las notas son requeridas').min(5, 'Las notas deben tener al menos 5 caracteres'),
  status: yup.string().required('El estado es requerido')
});

const ContactLogForm = ({ contactId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    method: 'call',
    notes: '',
    status: 'success'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

      const contactLogData = {
        contactId,
        method: formData.method,
        notes: formData.notes,
        status: formData.status,
        date: new Date().toISOString()
      };

      await contactLogService.createContactLog(contactLogData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al guardar la interacción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
      <h3 className="font-medium text-gray-800 mb-3">Nueva interacción</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="method">
            Método de contacto *
          </label>
          <select
            id="method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            className={`w-full border ${validationErrors.method ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
          >
            <option value="call">Llamada</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="meeting">Reunión</option>
            <option value="other">Otro</option>
          </select>
          {validationErrors.method && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.method}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
            Notas *
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            className={`w-full border ${validationErrors.notes ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            placeholder="Detalles de la interacción"
          ></textarea>
          {validationErrors.notes && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.notes}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
            Estado *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full border ${validationErrors.status ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
          >
            <option value="success">Exitoso</option>
            <option value="pending">Pendiente</option>
            <option value="failed">No exitoso</option>
          </select>
          {validationErrors.status && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.status}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
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
              'Guardar interacción'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactLogForm;