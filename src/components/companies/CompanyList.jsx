import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import companyService from '../../services/companyService';
import DeleteConfirmation from '../common/DeleteConfirmation';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    companyId: null
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getCompanies();
      setCompanies(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setCompanies([]);
      setError(err.message || 'Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (id) => {
    setDeleteConfirmation({
      isOpen: true,
      companyId: id
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      companyId: null
    });
  };

  const confirmDelete = async () => {
    try {
      await companyService.deleteCompany(deleteConfirmation.companyId);
      fetchCompanies();
      closeDeleteConfirmation();
    } catch (err) {
      setError(err.message || 'Error al eliminar la empresa');
      closeDeleteConfirmation();
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Empresas</h1>
        <Link 
          to="/companies/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Nueva Empresa
        </Link>
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
          {companies.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              No hay empresas registradas.
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sitio Web
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{company.industry || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {company.website ? (
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {company.website}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{company.address || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/companies/${company.id}`}
                          className="text-gray-600 hover:text-gray-900 mr-4"
                        >
                          Ver
                        </Link>
                        <Link 
                          to={`/companies/edit/${company.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => openDeleteConfirmation(company.id)}
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
          )}
        </>
      )}

      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        title="Eliminar Empresa"
        message="¿Estás seguro de que deseas eliminar esta empresa? También se eliminarán todos los contactos asociados a ella. Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default CompanyList;
