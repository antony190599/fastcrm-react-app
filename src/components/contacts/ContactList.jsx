import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import contactService from '../../services/contactService';
import DeleteConfirmation from '../common/DeleteConfirmation';
import Pagination from '../common/Pagination';
import AppHeader from '../common/AppHeader';
import { EyeIcon, PencilSquareIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

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

  // Add state for selected contacts
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, [orderBy, currentPage, itemsPerPage]);

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
        setContacts(response.data || []);
        
        // Update pagination state from API response
        if (response.meta && response.meta.pagination) {
          const { pagination } = response.meta;
          setCurrentPage(pagination.currentPage);
          setTotalPages(pagination.totalPages);
          setTotalItems(pagination.totalItems);
        }
        
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
      fetchContacts();
      closeDeleteConfirmation();
    } catch (err) {
      setError(err.message || 'Error al eliminar el contacto');
      closeDeleteConfirmation();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };
  
  const handleSelectAllContacts = (e) => {
    if (e.target.checked) {
      const allIds = contacts.map(contact => contact.id);
      setSelectedContacts(allIds);
    } else {
      setSelectedContacts([]);
    }
  };
  
  const handleSendBulkMessage = () => {
    if (selectedContacts.length > 0) {
      // Find the contact objects for the selected IDs
      const selectedContactObjects = contacts.filter(contact => 
        selectedContacts.includes(contact.id)
      );
      
      // Navigate to the bulk message form with the selected contacts
      navigate('/templates/send-bulk', { 
        state: { contacts: selectedContactObjects } 
      });
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

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700 mr-4">Ordenar por:</label>
          <select
            value={orderBy}
            onChange={handleOrderChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Nombre y Apellido</option>
            <option value="company">Empresa</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {contacts.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              No hay contactos registrados.
            </div>
          ) : (
            <>
              {/* Add bulk message action when contacts are selected */}
              {selectedContacts.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-center">
                  <span className="text-blue-700">
                    {selectedContacts.length} contacto(s) seleccionado(s)
                  </span>
                  <button 
                    onClick={handleSendBulkMessage}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </button>
                </div>
              )}
            
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={handleSelectAllContacts}
                            checked={selectedContacts.length > 0 && selectedContacts.length === contacts.length}
                          />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cargo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empresa
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(contacts) && contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleSelectContact(contact.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {`${contact.firstName} ${contact.lastName}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.title || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.company ? (
                            <Link 
                              to={`/companies/${contact.companyId}`}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              {contact.company.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end">
                            <Link 
                              to={`/contacts/${contact.id}`}
                              className="text-gray-600 hover:text-gray-900 mr-4"
                              title="Ver"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link 
                              to={`/contacts/edit/${contact.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
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
              
              {/* Pagination */}
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}
        </>
      )}

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
