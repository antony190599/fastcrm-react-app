import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import contactService from '../../services/contactService';
import DeleteConfirmation from '../common/DeleteConfirmation';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    contactId: null
  });
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchContacts();
  }, [orderBy]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const options = {};
      if (orderBy) {
        options.orderBy = orderBy;
      }
      
      const response = await contactService.getContacts(options);
      setContacts(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setContacts([]);
      setError(err.message || 'Error al cargar los contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
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

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Reset to first page when order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderBy]);

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contactos</h1>
        <Link 
          to="/contacts/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Nuevo Contacto
        </Link>
      </div>

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
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                    {Array.isArray(currentItems) && currentItems.map((contact) => (
                      <tr key={contact.id}>
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
                          <Link 
                            to={`/contacts/${contact.id}`}
                            className="text-gray-600 hover:text-gray-900 mr-4"
                          >
                            Ver
                          </Link>
                          <Link 
                            to={`/contacts/edit/${contact.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => openDeleteConfirmation(contact.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {contacts.length > itemsPerPage && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      Anterior
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                  
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">
                          {Math.min(indexOfLastItem, contacts.length)}
                        </span> de <span className="font-medium">{contacts.length}</span> resultados
                      </p>
                    </div>
                    
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {/* Previous page button */}
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium ${
                            currentPage === 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          } ring-1 ring-inset ring-gray-300`}
                        >
                          Anterior
                        </button>
                        
                        {/* Page indicator */}
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                          Página {currentPage} de {totalPages}
                        </span>
                        
                        {/* Next page button */}
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium ${
                            currentPage === totalPages 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          } ring-1 ring-inset ring-gray-300`}
                        >
                          Siguiente
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
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
