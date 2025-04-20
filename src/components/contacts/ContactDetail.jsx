import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import contactService from '../../services/contactService';
import DeleteConfirmation from '../common/DeleteConfirmation';
import AppHeader from '../common/AppHeader';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    contactId: null
  });

  useEffect(() => {
    if (id) {
      fetchContact();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContactById(id);
      setContact(response.data);
      setError(null);
    } catch (err) {
      setContact(null);
      setError(err.message || 'Error al cargar el contacto');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = () => {
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
      await contactService.deleteContact(id);
      navigate('/contacts');
    } catch (err) {
      setError(err.message || 'Error al eliminar el contacto');
      closeDeleteConfirmation();
    }
  };

  const handleSendMessage = () => {
    navigate(`/templates/send/${id}`, { state: { contact } });
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
          <Link to="/contacts" className="text-blue-600 hover:underline">
            ← Volver a la lista de contactos
          </Link>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No se encontró el contacto solicitado
        </div>
        <div className="mt-4">
          <Link to="/contacts" className="text-blue-600 hover:underline">
            ← Volver a la lista de contactos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title="Detalle del Contacto"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Contactos', href: '/contacts' },
          { name: contact ? `${contact.firstName} ${contact.lastName}` : 'Detalle' }
        ]}
        actionLinks={[
          { 
            label: 'Enviar Mensaje', 
            href: '#', 
            onClick: handleSendMessage,
            className: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2 flex items-center'
          },
          { 
            label: 'Editar', 
            href: `/contacts/edit/${id}` 
          },
          { 
            label: 'Eliminar', 
            href: '#', 
            onClick: openDeleteConfirmation,
            className: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
          }
        ]}
      />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Nombre completo:</span>
                <p className="font-medium">{`${contact.firstName} ${contact.lastName}`}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Email:</span>
                <p className="font-medium">
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Teléfono:</span>
                <p className="font-medium">
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">No especificado</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Cargo:</span>
                <p className="font-medium">
                  {contact.title || <span className="text-gray-400">No especificado</span>}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Información de la Empresa</h2>
            {contact.company ? (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Nombre de la empresa:</span>
                  <p className="font-medium">
                    <Link to={`/companies/${contact.companyId}`} className="text-blue-600 hover:underline">
                      {contact.company.name}
                    </Link>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Industria:</span>
                  <p className="font-medium">
                    {contact.company.industry || <span className="text-gray-400">No especificada</span>}
                  </p>
                </div>
                {contact.company.website && (
                  <div>
                    <span className="text-gray-500 text-sm">Sitio web:</span>
                    <p className="font-medium">
                      <a 
                        href={contact.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {contact.company.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No hay empresa asociada a este contacto.</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              Creado: {new Date(contact.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-500 text-sm">
              Última actualización: {new Date(contact.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/contacts" className="text-blue-600 hover:underline">
          ← Volver a la lista de contactos
        </Link>
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

export default ContactDetail;
