import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import messageService from '../../services/messageService';
import templateService from '../../services/templateService';
import AppHeader from '../common/AppHeader';
import contactLogService from '../../services/contactLogService';

// Define validation schema
const validationSchema = yup.object().shape({
  method: yup.string().oneOf(['email', 'whatsapp'], 'Método de envío inválido').required('El método de envío es requerido'),
  subject: yup.string().when('method', {
    is: 'email',
    then: () => yup.string().required('El asunto es requerido para emails'),
    otherwise: () => yup.string()
  }),
  content: yup.string().required('El contenido del mensaje es requerido').min(5, 'El contenido debe tener al menos 5 caracteres')
});

const BulkMessageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Contacts come from the navigation state
  const initialContacts = location.state?.contacts || [];
  
  // State for form data
  const [formData, setFormData] = useState({
    method: 'email',
    subject: '',
    content: ''
  });
  
  // State for contact processing
  const [contacts, setContacts] = useState([]);
  const [contactStatus, setContactStatus] = useState({});
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [autoDiscard, setAutoDiscard] = useState(false);
  const [processingContact, setProcessingContact] = useState(false);
  
  // State for templates and form state
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [processComplete, setProcessComplete] = useState(false);
  
  // New state for template filtering
  const [templateTypes, setTemplateTypes] = useState([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState('');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  
  // Initialize contact status when contacts change
  useEffect(() => {
    if (initialContacts.length > 0) {
      const statusObj = {};
      initialContacts.forEach(contact => {
        statusObj[contact.id] = 'pending';
      });
      setContactStatus(statusObj);
      setContacts(initialContacts);
    }
  }, [initialContacts]);
  
  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Apply filters when type or search query change
  useEffect(() => {
    filterTemplates();
  }, [selectedTemplateType, templateSearchQuery, templates]);

  const fetchTemplates = async () => {
    try {
      const response = await templateService.getTemplates({ limit: 100 });
      if (response.success && response.data) {
        const templatesData = response.data;
        setTemplates(templatesData);
        
        // Extract unique template types for the dropdown
        const types = [...new Set(templatesData.map(template => template.type))];
        setTemplateTypes(types);
        
        // Initialize filtered templates
        setFilteredTemplates(templatesData);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };
  
  const filterTemplates = () => {
    let filtered = [...templates];
    
    // Filter by type if selected
    if (selectedTemplateType) {
      filtered = filtered.filter(template => template.type === selectedTemplateType);
    }
    
    // Filter by search query if provided
    if (templateSearchQuery.trim() !== '' && templateSearchQuery.length >= 2) {
      const query = templateSearchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.content.toLowerCase().includes(query) || 
        template.type.toLowerCase().includes(query)
      );
    }
    
    setFilteredTemplates(filtered);
  };
  
  const handleTemplateTypeChange = (e) => {
    setSelectedTemplateType(e.target.value);
  };
  
  const handleTemplateSearchChange = (e) => {
    setTemplateSearchQuery(e.target.value);
  };
  
  const handleApplyTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        content: template.content,
        subject: template.type === 'bienvenida' ? 'Bienvenido' : 'Seguimiento'
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
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      method: value
    }));
    
    await validateField('method', value);
    
    if (value === 'whatsapp') {
      setValidationErrors(prev => ({ ...prev, subject: undefined }));
    } else {
      await validateField('subject', formData.subject);
    }
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
  
  const handleAutoDiscardChange = (e) => {
    setAutoDiscard(e.target.checked);
  };
  
  const discardContact = (contactId) => {
    setContactStatus(prev => ({
      ...prev,
      [contactId]: 'discarded'
    }));
    
    // Move to next contact if not at the end
    if (currentContactIndex < contacts.length - 1) {
      setCurrentContactIndex(currentContactIndex + 1);
    } else {
      setProcessComplete(true);
    }
  };
  
  const moveToNextContact = () => {
    if (currentContactIndex < contacts.length - 1) {
      setCurrentContactIndex(currentContactIndex + 1);
    } else {
      setProcessComplete(true);
    }
  };
  
  const processCurrentContact = async () => {
    const currentContact = contacts[currentContactIndex];
    if (!currentContact) return;
    
    // Check if contact has required info for the selected method
    if (formData.method === 'email' && !currentContact.email) {
      setContactStatus(prev => ({
        ...prev,
        [currentContact.id]: 'error'
      }));
      
      if (autoDiscard) {
        discardContact(currentContact.id);
      }
      return;
    }
    
    if (formData.method === 'whatsapp' && !currentContact.phone) {
      setContactStatus(prev => ({
        ...prev,
        [currentContact.id]: 'error'
      }));
      
      if (autoDiscard) {
        discardContact(currentContact.id);
      }
      return;
    }
    
    try {
      setProcessingContact(true);
      
      // If using WhatsApp with direct wa.me links
      if (formData.method === 'whatsapp') {
        // Clean the phone number (remove spaces, dashes, parentheses)
        const cleanPhone = currentContact.phone.replace(/[\s\-\(\)]/g, '');
        
        // Construct the wa.me URL
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formData.content)}`;
        
        try {
          // Register the message in the backend
          const payload = {
            method: 'whatsapp',
            content: formData.content,
            templateId: selectedTemplateId || null,
            templateName: selectedTemplateId ? templates.find(t => t.id === selectedTemplateId)?.type : null
          };
          
          // Register the message even though it opens in a new window
          const response = await messageService.sendMessage(currentContact.id, payload);
          
          // Create contact log
          await contactLogService.createMessageLog(currentContact.id, {
            ...payload,
            messageId: response.data?.id
          });
          
          // Open the link in a new tab
          window.open(waUrl, '_blank');
          
          // Mark as sent
          setContactStatus(prev => ({
            ...prev,
            [currentContact.id]: 'sent'
          }));
          
          // Auto discard if setting is enabled
          if (autoDiscard) {
            setTimeout(() => {
              discardContact(currentContact.id);
            }, 500);
          }
        } catch (err) {
          // Handle error during WhatsApp message registration
          setContactStatus(prev => ({
            ...prev,
            [currentContact.id]: 'error'
          }));
          console.error('Error registrando mensaje de WhatsApp:', err);
        }
      } else {
        // Send email via API
        const payload = {
          method: formData.method,
          content: formData.content,
          subject: formData.method === 'email' ? formData.subject : undefined,
          templateId: selectedTemplateId || null,
          templateName: selectedTemplateId ? templates.find(t => t.id === selectedTemplateId)?.type : null
        };
        
        const response = await messageService.sendMessage(currentContact.id, payload);
        
        if (response.success) {
          // Create contact log
          await contactLogService.createMessageLog(currentContact.id, {
            ...payload,
            messageId: response.data?.id
          });
          
          setContactStatus(prev => ({
            ...prev,
            [currentContact.id]: 'sent'
          }));
          
          // Auto discard if setting is enabled
          if (autoDiscard) {
            setTimeout(() => {
              discardContact(currentContact.id);
            }, 500);
          }
        } else {
          setContactStatus(prev => ({
            ...prev,
            [currentContact.id]: 'error'
          }));
        }
      }
    } catch (err) {
      setContactStatus(prev => ({
        ...prev,
        [currentContact.id]: 'error'
      }));
      console.error('Error sending message:', err);
    } finally {
      setProcessingContact(false);
    }
  };
  
  const handleSendToCurrentContact = async () => {
    const isValid = await validateForm();
    if (!isValid) return;
    
    await processCurrentContact();
  };
  
  const getCompletionStats = () => {
    const sentCount = Object.values(contactStatus).filter(status => status === 'sent').length;
    const errorCount = Object.values(contactStatus).filter(status => status === 'error').length;
    const discardedCount = Object.values(contactStatus).filter(status => status === 'discarded').length;
    const pendingCount = Object.values(contactStatus).filter(status => status === 'pending').length;
    
    return {
      sentCount,
      errorCount,
      discardedCount,
      pendingCount,
      totalCount: contacts.length
    };
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'sent':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Enviado</span>;
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Error</span>;
      case 'discarded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Descartado</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Pendiente</span>;
    }
  };
  
  const stats = getCompletionStats();
  
  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title="Enviar Mensaje Masivo"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Contactos', href: '/contacts' },
          { name: 'Enviar Mensaje Masivo' }
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
      
      {processComplete && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Proceso finalizado: {stats.sentCount} enviados, {stats.errorCount} errores, {stats.discardedCount} descartados
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Enviar mensaje a {contacts.length} contacto(s)</h2>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mr-2">Estado:</span>
            <span className="font-medium text-blue-600">{stats.sentCount + stats.discardedCount + stats.errorCount}</span> / <span>{stats.totalCount}</span> procesados
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Contactos seleccionados:</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact, index) => (
                  <tr key={contact.id} className={index === currentContactIndex ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${contact.firstName} ${contact.lastName}`}
                        {index === currentContactIndex && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Actual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contact.email || 'No disponible'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contact.phone || 'No disponible'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contact.company?.name || 'No disponible'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contactStatus[contact.id])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Template Selection - Updated UI */}
        {templates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">Aplicar Plantilla</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Template Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  onChange={handleTemplateTypeChange}
                  value={selectedTemplateType}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Todos</option>
                  {templateTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Template Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Búsqueda (mín. 2 caracteres)
                </label>
                <input
                  type="text"
                  placeholder="Buscar por contenido..."
                  value={templateSearchQuery}
                  onChange={handleTemplateSearchChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            
            {/* Template Selection */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccione una plantilla...
              </label>
              <select
                onChange={(e) => handleApplyTemplate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={selectedTemplateId}
              >
                <option value="">Seleccione una plantilla...</option>
                {filteredTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.type}: {template.content.substring(0, 30)}...
                  </option>
                ))}
              </select>
              {filteredTemplates.length === 0 && templateSearchQuery && (
                <p className="mt-1 text-xs text-amber-600">No se encontraron plantillas que coincidan con tu búsqueda.</p>
              )}
            </div>
          </div>
        )}
        
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
        
        {/* Message Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
            Contenido del Mensaje *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className={`w-full border ${validationErrors.content ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
            placeholder="Escribe el contenido del mensaje..."
          ></textarea>
          {validationErrors.content && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.content}</p>
          )}
        </div>
        
        {/* Auto discard option */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoDiscard}
              onChange={handleAutoDiscardChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-sm text-gray-700">Descartar automáticamente después de enviar</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Si se activa, después de enviar un mensaje al contacto actual se pasará automáticamente al siguiente.
          </p>
        </div>
        
        {/* Current contact info */}
        {contacts.length > 0 && currentContactIndex < contacts.length && (
          <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Contacto actual:</h3>
            <div className="flex flex-col space-y-1">
              <p>
                <span className="font-medium">Nombre:</span> {contacts[currentContactIndex].firstName} {contacts[currentContactIndex].lastName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {contacts[currentContactIndex].email || 'No disponible'}
              </p>
              <p>
                <span className="font-medium">Teléfono:</span> {contacts[currentContactIndex].phone || 'No disponible'}
              </p>
              {contacts[currentContactIndex].company && (
                <p>
                  <span className="font-medium">Empresa:</span> {contacts[currentContactIndex].company.name}
                </p>
              )}
              <p>
                <span className="font-medium">Estado:</span> {contactStatus[contacts[currentContactIndex].id] || 'pending'}
              </p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/contacts')}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          
          {currentContactIndex < contacts.length && (
            <>
              <button
                type="button"
                onClick={() => discardContact(contacts[currentContactIndex].id)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                disabled={processingContact || contactStatus[contacts[currentContactIndex].id] === 'discarded'}
              >
                Descartar contacto actual
              </button>
              
              <button
                type="button"
                onClick={handleSendToCurrentContact}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                disabled={processingContact || contactStatus[contacts[currentContactIndex].id] === 'sent'}
              >
                {processingContact ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : contactStatus[contacts[currentContactIndex].id] === 'sent' ? (
                  'Enviado'
                ) : (
                  `Enviar a ${contacts[currentContactIndex].firstName}`
                )}
              </button>
            </>
          )}
          
          {currentContactIndex < contacts.length && contactStatus[contacts[currentContactIndex].id] === 'sent' && (
            <button
              type="button"
              onClick={moveToNextContact}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Siguiente contacto
            </button>
          )}
          
          {processComplete && (
            <button
              type="button"
              onClick={() => navigate('/contacts')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkMessageForm;