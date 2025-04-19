import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import messageService from '../../services/messageService';
import templateService from '../../services/templateService';
import PageHeader from '../common/PageHeader';

// Define validation schema
const validationSchema = yup.object().shape({
  contactId: yup.string().required('El contacto es requerido'),
  method: yup.string().oneOf(['email', 'whatsapp'], 'Método de envío inválido').required('El método de envío es requerido'),
  subject: yup.string().when('method', {
    is: 'email',
    then: () => yup.string().required('El asunto es requerido para emails'),
    otherwise: () => yup.string()
  }),
  content: yup.string().required('El contenido del mensaje es requerido').min(5, 'El contenido debe tener al menos 5 caracteres')
});

const MessageForm = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const location = useLocation();
  const contact = location.state?.contact || null;
  const template = location.state?.template || null;
  
  const [formData, setFormData] = useState({
    contactId: contactId || '',
    method: 'email',
    subject: template?.type === 'bienvenida' ? 'Bienvenido' : 'Seguimiento',
    content: template?.content || ''
  });

  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedContact, setSelectedContact] = useState(contact);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  // Add a new state to track the selected template ID
  const [selectedTemplateId, setSelectedTemplateId] = useState(template?.id || '');

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
    
    // If contactId is provided, set the formData
    if (contactId) {
      setFormData(prev => ({
        ...prev,
        contactId
      }));
    }

    // If contact object is provided via location state, set it as selected
    if (contact) {
      setSelectedContact(contact);
    }

    // If template is provided via location state, set its content
    if (template) {
      setFormData(prev => ({
        ...prev,
        content: template.content,
        subject: template.type === 'bienvenida' ? 'Bienvenido' : 'Seguimiento'
      }));
      // Set the selected template ID
      setSelectedTemplateId(template.id);
    }
  }, [contactId, contact, template]);

  const fetchTemplates = async () => {
    try {
      const response = await templateService.getTemplates({ limit: 100 });
      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (err) {
      console.error('Error fetching templates', err);
    }
  };

  const handleApplyTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        content: template.content
      }));
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

  const handleMethodChange = async (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      method: value
    }));
    
    // Validate the method field
    await validateField('method', value);
    
    // If switching from email to whatsapp, validate subject isn't required anymore
    if (value === 'whatsapp') {
      setValidationErrors(prev => ({ ...prev, subject: undefined }));
    } else {
      // Re-validate subject for email
      await validateField('subject', formData.subject);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      searchContacts(query);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const searchContacts = async (query) => {
    try {
      if (query.length < 2) return;
      
      const response = await messageService.searchContacts(query);
      if (response.success) {
        setSearchResults(response.data || []);
      }
    } catch (err) {
      console.error('Error searching contacts', err);
      setSearchResults([]);
    }
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setFormData(prev => ({
      ...prev,
      contactId: contact.id
    }));
    setSearchQuery('');
    setShowSearchResults(false);
    
    // Validate contactId field
    validateField('contactId', contact.id);
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
    
    // Additional validation for contact information
    if (selectedContact) {
      if (formData.method === 'email' && !selectedContact.email) {
        setValidationErrors(prev => ({
          ...prev,
          contactId: 'El contacto seleccionado no tiene email'
        }));
        return;
      }
      
      if (formData.method === 'whatsapp' && !selectedContact.phone) {
        setValidationErrors(prev => ({
          ...prev,
          contactId: 'El contacto seleccionado no tiene número de teléfono'
        }));
        return;
      }
    }
    
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setLoading(true);
      setError(null);
      
      // If using WhatsApp and we want to direct to wa.link
      if (formData.method === 'whatsapp' && selectedContact?.phone) {
        // Clean the phone number (remove spaces, dashes, parentheses)
        const cleanPhone = selectedContact.phone.replace(/[\s\-\(\)]/g, '');
        
        // Construct the wa.me URL (WhatsApp's official click-to-chat link format)
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formData.content)}`;
        
        // Open the link in a new tab
        window.open(waUrl, '_blank');
        
        setSuccess('Link de WhatsApp abierto en una nueva pestaña');
        
        // Reset form after success
        setFormData({
          contactId: '',
          method: 'email',
          subject: '',
          content: ''
        });
        setSelectedContact(null);
        
        setLoading(false);
        return;
      }
      
      // Otherwise proceed with API call for email or backend WhatsApp integration
      const payload = {
        method: formData.method,
        content: formData.content
      };
      
      // Only include subject for email messages
      if (formData.method === 'email') {
        payload.subject = formData.subject;
      }
      
      const response = await messageService.sendMessage(formData.contactId, payload);
      
      if (response.success) {
        setSuccess(`Mensaje enviado correctamente vía ${formData.method === 'email' ? 'correo electrónico' : 'WhatsApp'}`);
        
        // Reset form after success
        setFormData({
          contactId: '',
          method: 'email',
          subject: '',
          content: ''
        });
        setSelectedContact(null);
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/templates');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const renderContactInfo = () => {
    if (!selectedContact) return null;
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-gray-800">Contacto seleccionado:</h3>
        <p className="text-gray-700">{selectedContact.firstName} {selectedContact.lastName}</p>
        {selectedContact.email && (
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Email:</span> {selectedContact.email}
          </p>
        )}
        {selectedContact.phone && (
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Teléfono:</span> {selectedContact.phone}
          </p>
        )}
        {selectedContact.company && (
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Empresa:</span> {selectedContact.company.name}
          </p>
        )}
      </div>
    );
  };
  
  return (
    <div className="mx-auto px-4 py-8">
      <PageHeader 
        title="Enviar Plantilla"
        backLink={{ to: '/templates', text: 'Volver a Plantillas' }}
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
        <form onSubmit={handleSubmit}>
          {/* Contact Selection */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Contacto *
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Buscar por nombre, email o empresa..."
              disabled={selectedContact !== null}
            />
            
            {/* Display search results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                {searchResults.map(contact => (
                  <div 
                    key={contact.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => selectContact(contact)}
                  >
                    <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                    <div className="text-sm text-gray-600">
                      {contact.email || 'No email'} | {contact.company?.name || 'No company'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-2 px-4">
                No se encontraron contactos con "{searchQuery}"
              </div>
            )}

            {/* Clear selected contact button */}
            {selectedContact && (
              <button
                type="button"
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setSelectedContact(null);
                  setFormData(prev => ({ ...prev, contactId: '' }));
                }}
              >
                Cambiar contacto
              </button>
            )}

            {validationErrors.contactId && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.contactId}</p>
            )}
            
            {/* Display selected contact info */}
            {renderContactInfo()}
          </div>
          
          {/* Message Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Envío *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="email"
                  checked={formData.method === 'email'}
                  onChange={handleMethodChange}
                  className="mr-2"
                />
                Email
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="whatsapp"
                  checked={formData.method === 'whatsapp'}
                  onChange={handleMethodChange}
                  className="mr-2"
                />
                WhatsApp
              </label>
            </div>
            {validationErrors.method && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.method}</p>
            )}
          </div>
          
          {/* Subject (only for email) */}
          {formData.method === 'email' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
                Asunto *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full border ${validationErrors.subject ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                placeholder="Asunto del email"
              />
              {validationErrors.subject && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.subject}</p>
              )}
            </div>
          )}
          
          {/* Template Selection */}
          {templates.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aplicar Plantilla
              </label>
              <select
                onChange={(e) => handleApplyTemplate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={selectedTemplateId}
              >
                <option value="" disabled>Seleccione una plantilla...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.type}: {template.content.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Message Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
              Contenido de la Plantilla *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className={`w-full border ${validationErrors.content ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="Escribe el contenido de la plantilla..."
            ></textarea>
            {validationErrors.content && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.content}</p>
            )}
          </div>
          
          {/* Submit Button */}
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              disabled={loading || !selectedContact}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                `Enviar por ${formData.method === 'email' ? 'Email' : 'WhatsApp'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
