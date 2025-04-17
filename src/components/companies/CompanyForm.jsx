import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import companyService from '../../services/companyService';
import * as yup from 'yup';

// Define validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  ruc: yup.string().matches(/^[0-9]{11}$/, 'El RUC debe tener 11 dígitos numéricos'),
  industry: yup.string(),
  website: yup.string().url('Debe ser una URL válida'),
  address: yup.string()
});

const CompanyForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    industry: '',
    website: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      fetchCompany();
    }
  }, [isEditing, id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const company = await companyService.getCompanyById(id);
      setFormData({
        name: company.data.name || '',
        ruc: company.data.ruc || '',
        industry: company.data.industry || '',
        website: company.data.website || '',
        address: company.data.address || '',
      });
    } catch (err) {
      setError(err.message || 'Error al cargar la empresa');
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
        await companyService.updateCompany(id, formData);
        setSuccess('Empresa actualizada correctamente');
      } else {
        await companyService.createCompany(formData);
        setSuccess('Empresa creada correctamente');
        setFormData({
          name: '',
          industry: '',
          ruc: '',
          website: '',
          address: ''
        });
      }
      
      navigate('/companies');
      
    } catch (err) {
      setError(err.message || 'Error al guardar la empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
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
        {loading && isEditing ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Nombre *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Nombre de la empresa"
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ruc">
                RUC
              </label>
              <input
                type="text"
                id="ruc"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                className={`w-full border ${validationErrors.ruc ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Número de RUC"
              />
              {validationErrors.ruc && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.ruc}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="industry">
                Industria
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full border ${validationErrors.industry ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Industria o sector"
              />
              {validationErrors.industry && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.industry}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
                Sitio Web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full border ${validationErrors.website ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="https://ejemplo.com"
              />
              {validationErrors.website && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.website}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                Dirección
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Dirección de la empresa"
              ></textarea>
              {validationErrors.address && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.address}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/companies')}
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

export default CompanyForm;
