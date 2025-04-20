import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import companyService from '../../services/companyService';
import DeleteConfirmation from '../common/DeleteConfirmation';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    companyId: null
  });

  useEffect(() => {
    if (id) {
      fetchCompany();
    }
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await companyService.getCompanyById(id);
      setCompany(response.data);
      setError(null);
    } catch (err) {
      setCompany(null);
      setError(err.message || 'Error al cargar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = () => {
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
      await companyService.deleteCompany(id);
      navigate('/companies');
    } catch (err) {
      setError(err.message || 'Error al eliminar la empresa');
      closeDeleteConfirmation();
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/companies" className="text-blue-600 hover:underline">
            ← Volver a la lista de empresas
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No se encontró la empresa solicitada
        </div>
        <div className="mt-4">
          <Link to="/companies" className="text-blue-600 hover:underline">
            ← Volver a la lista de empresas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalle de la Empresa</h1>
        <div className="flex space-x-2">
          <Link 
            to={`/contacts/new`}
            state={{ preselectedCompany: { id: company.id, name: company.name } }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2 flex items-center"
            title="Nuevo Contacto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Contacto
          </Link>
          <Link 
            to={`/companies/edit/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
          >
            Editar
          </Link>
          <button 
            onClick={openDeleteConfirmation}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Información de la Empresa</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Nombre:</span>
                <p className="font-medium">{company.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">RUC:</span>
                <p className="font-medium">{company.ruc || <span className="text-gray-400">No especificado</span>}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Industria:</span>
                <p className="font-medium">
                  {company.industry || <span className="text-gray-400">No especificada</span>}
                </p>
              </div>
              {company.website && (
                <div>
                  <span className="text-gray-500 text-sm">Sitio web:</span>
                  <p className="font-medium">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>
              )}
              {company.address && (
                <div>
                  <span className="text-gray-500 text-sm">Dirección:</span>
                  <p className="font-medium">{company.address}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contactos Asociados</h2>
              <Link 
                to={`/contacts/new`}
                state={{ preselectedCompany: { id: company.id, name: company.name } }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Añadir contacto
              </Link>
            </div>
            
            {company.contacts && company.contacts.length > 0 ? (
              <div className="space-y-4">
                {company.contacts.map(contact => (
                  <div key={contact.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                    <Link to={`/contacts/${contact.id}`} className="block">
                      <div className="font-medium text-blue-600">{contact.firstName} {contact.lastName}</div>
                      <div className="text-sm text-gray-600">
                        {contact.email && (
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {contact.email}
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {contact.phone}
                          </div>
                        )}
                        {contact.title && (
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {contact.title}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No hay contactos asociados a esta empresa</p>
                <Link 
                  to={`/contacts/new`}
                  state={{ preselectedCompany: { id: company.id, name: company.name } }}
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800"
                >
                  Añadir un nuevo contacto
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              Creado: {new Date(company.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-500 text-sm">
              Última actualización: {new Date(company.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/companies" className="text-blue-600 hover:underline">
          ← Volver a la lista de empresas
        </Link>
      </div>

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

export default CompanyDetail;
