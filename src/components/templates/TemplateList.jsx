import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import templateService from '../../services/templateService';
import DeleteConfirmation from '../common/DeleteConfirmation';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import AppHeader from '../common/AppHeader';
import { EyeIcon, PencilSquareIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

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
  // Template preview modal
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    template: null
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, itemsPerPage]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const validFilters = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (filters.type) validFilters.type = filters.type;
      if (filters.q && filters.q.length >= 2) validFilters.q = filters.q;
      
      const response = await templateService.getTemplates(validFilters);
      
      if (response.success) {
        setTemplates(response.data || []);
        
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
    setCurrentPage(1); // Reset to first page when searching
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openPreviewModal = (template) => {
    setPreviewModal({
      isOpen: true,
      template
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      template: null
    });
  };

  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title="Plantillas de Contenido"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Plantillas' }
        ]}
        actionLinks={[
          { label: 'Nueva Plantilla', href: '/templates/new' }
        ]}
      />

      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
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
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Búsqueda (min. 2 caracteres)
            </label>
            <div className="flex">
              <input
                type="text"
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                className="flex-1 border border-gray-300 rounded-l px-3 py-2"
                placeholder="Buscar por contenido..."
                minLength={2}
              />
              <button 
                type="submit" 
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-r"
              >
                Buscar
              </button>
            </div>
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
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contenido
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Autor
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Etiquetas
                        </th>
                        <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                          Fecha de Creación
                        </th>
                        <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(templates) && templates.map((template) => (
                        <tr key={template.id}>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              template.type === 'seguimiento' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {template.type}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-[150px] sm:max-w-[200px] md:max-w-md truncate">
                              {template.content}
                            </div>
                            {/* Información móvil adicional */}
                            <div className="md:hidden text-xs text-gray-500 mt-1">
                              <div>Autor: {template.author}</div>
                              {template.labels && template.labels.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {template.labels.slice(0, 2).map((label, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                                      {label}
                                    </span>
                                  ))}
                                  {template.labels.length > 2 && (
                                    <span className="text-xs text-gray-500">+{template.labels.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {template.author}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {template.labels && template.labels.map((label, i) => (
                                <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {label}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                            {new Date(template.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end">
                              <button
                                onClick={() => openPreviewModal(template)}
                                className="text-gray-600 hover:text-gray-900 mr-2 md:mr-4"
                                title="Ver"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <Link 
                                to={`/templates/edit/${template.id}`}
                                className="text-blue-600 hover:text-blue-900 mr-2 md:mr-4"
                                title="Editar"
                              >
                                <PencilSquareIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                to={`/templates/send`}
                                state={{ template: template }}
                                className="text-green-600 hover:text-green-900 mr-2 md:mr-4"
                                title="Enviar"
                              >
                                <PaperAirplaneIcon className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => openDeleteConfirmation(template.id)}
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
        title="Eliminar Plantilla"
        message="¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer."
      />

      {/* Template Preview Modal */}
      <Modal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        title="Detalle de Plantilla"
        size="lg"
      >
        {previewModal.template && (
          <div className="space-y-4">
            <div>
              <span className="text-gray-500 text-sm">Tipo:</span>
              <p className="font-medium">{previewModal.template.type}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Contenido:</span>
              <p className="whitespace-pre-wrap">{previewModal.template.content}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Autor:</span>
              <p>{previewModal.template.author}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closePreviewModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 mr-2"
              >
                Cerrar
              </button>
              <Link
                to="/templates/send"
                state={{ template: previewModal.template }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                onClick={closePreviewModal}
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-1" />
                Enviar
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplateList;