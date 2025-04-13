import React from 'react';
import Modal from './Modal';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirmar eliminación'}
    >
      <p className="text-gray-600 mb-4">
        {message || '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.'}
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;