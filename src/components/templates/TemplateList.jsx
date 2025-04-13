
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import templateService from '../../services/templateService';
import DeleteConfirmation from '../common/DeleteConfirmation';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    q: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    templateId: null
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const validFilters = {};
      
      if (filters.type) validFilters.type = filters.type;
      if (filters.q && filters.q.length >= 2) validFilters.q = filters.q;
      
      const response = await templateService.getTemplates(validFilters);
      setTemplates(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setTemplates([]);
      setError(err.message || 'Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTemplates();
  };

  const openDeleteConfirmation = (id) => {
    setDeleteConfirmation({
      isOpen: true,
      templateId: id
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      templateId: null
    });
  };

  const confirmDelete = async () => {
    try {
      await templateService.deleteTemplate(deleteConfirmation.templateId);
      fetchTemplates();
      closeDeleteConfirmation();
    } catch (err) {
      setError(err.message || 'Error al eliminar la plantilla');
      closeDeleteConfirmation();
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = templates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(templates.length / itemsPerPage);

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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plantillas de Contenido</h1>
        <Link 
          to="/templates/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Nueva Plantilla
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Todos</option>
              {['bienvenida', 'seguimiento'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Búsqueda (min. 2 caracteres)
            </label>
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Buscar por contenido..."
              minLength={2}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              type="submit" 
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
            >
              Buscar
            </button>
          </div>
        </form>
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
          {templates.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              No se encontraron plantillas con los filtros seleccionados.
            </div>
          ) : (
            <>
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contenido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Autor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Etiquetas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Creación
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(currentItems) && currentItems.map((template) => (
                      <tr key={template.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            template.type === 'seguimiento' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {template.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md truncate">
                            {template.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {template.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {template.labels && template.labels.map((label, i) => (
                              <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {label}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/templates/edit/${template.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => openDeleteConfirmation(template.id)}
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
              {templates.length > itemsPerPage && (
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
                          {Math.min(indexOfLastItem, templates.length)}
                        </span> de <span className="font-medium">{templates.length}</span> resultados
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
        title="Eliminar Plantilla"
        message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default TemplateList;