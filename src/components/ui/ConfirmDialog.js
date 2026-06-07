import React from 'react';
import { Modal, Button } from './index';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'error' }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
        variant === 'error' ? 'bg-error/10 text-error' : 'bg-primary-100 text-primary-600'
      }`}>
        <FiAlertTriangle size={24} />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{title || 'Confirm'}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button variant="primary" className="flex-1" onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
