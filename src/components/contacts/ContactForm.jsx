import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import contactService from '../../services/contactService';
import companyService from '../../services/companyService';
import AppHeader from '../common/AppHeader';
import * as yup from 'yup';

// Define validation schema
const validationSchema = yup.object().shape({
  firstName: yup.string().required('El nombre es requerido'),
  lastName: yup.string().required('El apellido es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  phone: yup.string(),
  title: yup.string(),
  companyId: yup.string()
});

const ContactForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCompany = location.state?.preselectedCompany;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    companyId: preselectedCompany?.id || ''
  });
  
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchCompanies();
    
    if (isEditing && id) {
      fetchContact();
    }
  }, [isEditing, id]);

  const fetchCompanies = async () => {
    try {
      const response = await companyService.getCompanies();
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Error al cargar las empresas');
    }
  };

  const fetchContact = async () => {
    try {
      setLoading(true);
      const contact = await contactService.getContactById(id);
      setFormData({
        firstName: contact.data.firstName || '',
        lastName: contact.data.lastName || '',
        email: contact.data.email || '',
        phone: contact.data.phone || '',
        title: contact.data.title || '',
        companyId: contact.data.companyId || ''
      });
    } catch (err) {
      setError(err.message || 'Error al cargar el contacto');
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
        await contactService.updateContact(id, formData);
        setSuccess('Contacto actualizado correctamente');
      } else {
        await contactService.createContact(formData);
        setSuccess('Contacto creado correctamente');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          title: '',
          companyId: ''
        });
      }
      
      navigate('/contacts');
      
    } catch (err) {
      setError(err.message || 'Error al guardar el contacto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title={isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Contactos', href: '/contacts' },
          { name: isEditing ? 'Editar Contacto' : 'Nuevo Contacto' }
        ]}
      />

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                  placeholder="Nombre"
                  required
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.firstName}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                  placeholder="Apellido"
                  required
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="email@ejemplo.com"
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="+34 XXXXXXXXX"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Cargo
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Director de Marketing, CEO, etc."
              />
              {validationErrors.title && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companyId">
                Empresa
                {preselectedCompany && <span className="text-blue-600 text-xs ml-2">(Preseleccionada)</span>}
              </label>
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className={`w-full border ${validationErrors.companyId ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              >
                <option value="">Seleccionar empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {validationErrors.companyId && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.companyId}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/contacts')}
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

export default ContactForm;
