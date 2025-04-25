import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import contactService from '../../services/contactService';
import messageService from '../../services/messageService'; // Añadir importación del servicio de mensajes
import DeleteConfirmation from '../common/DeleteConfirmation';
import Pagination from '../common/Pagination';
import AppHeader from '../common/AppHeader';
import { EyeIcon, PencilSquareIcon, TrashIcon, PaperAirplaneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    contactId: null
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Estado para almacenar los contactos seleccionados de TODAS las páginas
  const [selectedContacts, setSelectedContacts] = useState([]);
  
  // Nuevo estado para almacenar los contactos seleccionados completos (no solo IDs)
  const [selectedContactData, setSelectedContactData] = useState({});
  
  // Search state similar to MessageForm.jsx
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Estado para controlar si todos los contactos en la página actual están seleccionados
  const [allCurrentSelected, setAllCurrentSelected] = useState(false);

  useEffect(() => {
    // Solo cargar contactos al inicio o al cambiar paginación/orden si no estamos buscando
    if (!isSearching) {
      fetchContacts();
    }
  }, [orderBy, currentPage, itemsPerPage, isSearching]);

  // Verificar el estado de "todos seleccionados" cuando cambian los contactos o selecciones
  useEffect(() => {
    if (contacts.length > 0) {
      const allSelected = contacts.every(contact => selectedContacts.includes(contact.id));
      setAllCurrentSelected(allSelected);
    }
  }, [contacts, selectedContacts]);

  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        searchContacts(searchQuery);
      } else if (isSearching) {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  // Función para buscar contactos similar a MessageForm.jsx
  const searchContacts = async (query) => {
    try {
      setLoading(true);
      
      if (query.length < 2) {
        if (isSearching) {
          fetchContacts();
          setIsSearching(false);
        }
        return;
      }
      
      const response = await messageService.searchContacts(query);
      
      if (response.success) {
        setContacts(response.data || []);
        // Actualizar información de paginación
        setTotalItems(response.data?.length || 0);
        setCurrentPage(1);
        setTotalPages(Math.ceil((response.data?.length || 0) / itemsPerPage));
        setError(null);
      }
    } catch (err) {
      setContacts([]);
      setError(err.message || 'Error al buscar contactos');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const options = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (orderBy) {
        options.orderBy = orderBy;
      }
            
      const response = await contactService.getContacts(options);
      
      if (response.success) {
        const newContacts = response.data || [];
        setContacts(newContacts);
        
        // Update pagination state from API response
        if (response.meta && response.meta.pagination) {
          const { pagination } = response.meta;
          setCurrentPage(pagination.currentPage);
          setTotalPages(pagination.totalPages);
          setTotalItems(pagination.totalItems);
        }

        // Almacenar datos de contactos recibidos en el diccionario de seleccionados
        // si sus IDs están en la lista de seleccionados
        const newContactData = { ...selectedContactData };
        newContacts.forEach(contact => {
          if (selectedContacts.includes(contact.id)) {
            newContactData[contact.id] = {
              id: contact.id,
              firstName: contact.firstName,
              lastName: contact.lastName,
              email: contact.email,
              phone: contact.phone,
              title: contact.title,
              companyId: contact.companyId,
              company: contact.company ? {
                id: contact.company.id,
                name: contact.company.name
              } : null
            };
          }
        });
        setSelectedContactData(newContactData);
        
        setError(null);
      }
    } catch (err) {
      setContacts([]);
      setError(err.message || 'Error al cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
    setCurrentPage(1); // Reset to first page when changing order
    
    // Si estamos en modo búsqueda, volver a cargar todos los contactos
    if (isSearching) {
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  const openDeleteConfirmation = (id) => {
    setDeleteConfirmation({
      isOpen: true,
      contactId: id
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      contactId: null
    });
  };

  const confirmDelete = async () => {
    try {
      await contactService.deleteContact(deleteConfirmation.contactId);
      
      // Vuelve a cargar contactos o actualiza la búsqueda según el estado
      if (isSearching && searchQuery.length >= 2) {
        searchContacts(searchQuery);
      } else {
        fetchContacts();
      }
      
      closeDeleteConfirmation();
    } catch (err) {
      setError(err.message || 'Error al eliminar el contacto');
      closeDeleteConfirmation();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // No reiniciar las selecciones al cambiar de página
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
    // No reiniciar las selecciones al cambiar elementos por página
  };

  const handleSelectContact = (contactId) => {
    const contactToToggle = contacts.find(c => c.id === contactId);
    
    if (!contactToToggle) return;
    
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        // Si ya está seleccionado, elimínalo
        const newSelectedIds = prev.filter(id => id !== contactId);
        
        // También eliminar los datos del contacto del diccionario
        const newSelectedData = { ...selectedContactData };
        delete newSelectedData[contactId];
        setSelectedContactData(newSelectedData);
        
        return newSelectedIds;
      } else {
        // Si no está seleccionado, añádelo
        // También guardar los datos completos del contacto
        setSelectedContactData(prevData => ({
          ...prevData,
          [contactId]: {
            id: contactToToggle.id,
            firstName: contactToToggle.firstName,
            lastName: contactToToggle.lastName,
            email: contactToToggle.email,
            phone: contactToToggle.phone,
            title: contactToToggle.title,
            companyId: contactToToggle.companyId,
            company: contactToToggle.company ? {
              id: contactToToggle.company.id,
              name: contactToToggle.company.name
            } : null
          }
        }));
        
        return [...prev, contactId];
      }
    });
  };
  
  const handleSelectAllContacts = (e) => {
    if (e.target.checked) {
      // Seleccionar todos los contactos de la página actual
      const currentContactIds = contacts.map(contact => contact.id);
      
      // Combinar con los ya seleccionados de otras páginas
      const uniqueSelectedIds = [...new Set([...selectedContacts, ...currentContactIds])];
      setSelectedContacts(uniqueSelectedIds);
      
      // Actualizar también el diccionario de datos
      const newContactData = { ...selectedContactData };
      contacts.forEach(contact => {
        newContactData[contact.id] = {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          title: contact.title,
          companyId: contact.companyId,
          company: contact.company ? {
            id: contact.company.id,
            name: contact.company.name
          } : null
        };
      });
      setSelectedContactData(newContactData);
    } else {
      // Deseleccionar solo los contactos de la página actual
      const currentContactIds = contacts.map(contact => contact.id);
      const remainingSelectedIds = selectedContacts.filter(id => !currentContactIds.includes(id));
      setSelectedContacts(remainingSelectedIds);
      
      // Actualizar el diccionario eliminando los contactos deseleccionados
      const newContactData = { ...selectedContactData };
      currentContactIds.forEach(id => {
        delete newContactData[id];
      });
      setSelectedContactData(newContactData);
    }
  };
  
  const handleSendBulkMessage = () => {
    if (selectedContacts.length > 0) {
      // Crear un array con los objetos de contacto completos desde el diccionario
      const selectedContactObjects = Object.values(selectedContactData);
      
      console.log(`Enviando ${selectedContactObjects.length} contactos al formulario de mensajes masivos`);
      
      // Navegar a la página de envío masivo con los contactos seleccionados
      navigate('/templates/send-bulk', { 
        state: { contacts: selectedContactObjects } 
      });
    }
  };

  const handleClearAllSelections = () => {
    setSelectedContacts([]);
    setSelectedContactData({});
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // Si se borra el campo de búsqueda, restaurar el estado normal
    if (!e.target.value.trim()) {
      setIsSearching(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title="Contactos"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Contactos' }
        ]}
        actionLinks={[
          { label: 'Nuevo Contacto', href: '/contacts/new' }
        ]}
      />

      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={orderBy}
              onChange={handleOrderChange}
              className="mt-1 sm:mt-0 border border-gray-300 rounded px-3 py-2 w-full sm:w-auto"
            >
              <option value="">Nombre y Apellido</option>
              <option value="company">Empresa</option>
            </select>
          </div>

          {/* Search input with magnifying glass icon */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o apellido"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Acciones para mensajes en bulk - hacer responsive */}
        {selectedContacts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div>
              <span className="text-blue-700">
                {selectedContacts.length} contacto(s) seleccionado(s)
              </span>
              <button 
                onClick={handleClearAllSelections}
                className="ml-3 text-xs text-red-600 hover:text-red-800 underline"
              >
                Deseleccionar todos
              </button>
            </div>
            <button
              onClick={handleSendBulkMessage}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded flex items-center justify-center"
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-1" />
              Enviar mensaje masivo
            </button>
          </div>
        )}

        {/* Tabla de contactos con scroll horizontal */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        contacts.length > 0 &&
                        contacts.every(contact => selectedContacts.includes(contact.id))
                      }
                      onChange={handleSelectAllContacts}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Teléfono
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Empresa
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Cargo
                  </th>
                  <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(contacts) && contacts.map((contact) => (
                  <tr key={contact.id} className={selectedContacts.includes(contact.id) ? "bg-blue-50" : ""}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                      />
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${contact.firstName} ${contact.lastName}`}
                      </div>
                      {/* Mostrar email y teléfono en móvil */}
                      <div className="sm:hidden text-xs text-gray-500 mt-1">
                        {contact.email && <div>{contact.email}</div>}
                        {contact.phone && <div>{contact.phone}</div>}
                        {contact.company && <div>{contact.company.name}</div>}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-500">{contact.email || '-'}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500">{contact.phone || '-'}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      {contact.company ? (
                        <Link 
                          to={`/companies/${contact.companyId}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {contact.company.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-sm text-gray-500">{contact.title || '-'}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end">
                        <Link 
                          to={`/contacts/${contact.id}`}
                          className="text-gray-600 hover:text-gray-900 mr-2 md:mr-4"
                          title="Ver"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link 
                          to={`/contacts/edit/${contact.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-2 md:mr-4"
                          title="Editar"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => openDeleteConfirmation(contact.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Mantener la paginación como estaba */}
        {!isSearching && totalPages > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
            {selectedContacts.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Tienes contactos seleccionados en varias páginas. Puedes cambiar de página sin perder tu selección.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        title="Eliminar Contacto"
        message="¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default ContactList;
