import Modal from './Modal.jsx';
import Button from './Button.jsx';

/** Confirmación simple reutilizable */
export default function ConfirmDialog({
  open,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="confirm__msg">{message}</p>
    </Modal>
  );
}
