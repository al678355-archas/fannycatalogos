import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

export const CONFIRM_WORD = 'ELIMINAR';

/**
 * Eliminación con doble confirmación:
 *  1) "¿Estás seguro…?"
 *  2) Escribir ELIMINAR para confirmar.
 * Montar sólo cuando se abre (así el estado se reinicia cada vez).
 */
export default function DoubleConfirmDelete({ itemLabel = 'este producto', itemName, onConfirm, onCancel }) {
  const [step, setStep] = useState(1);
  const [typed, setTyped] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (typed !== CONFIRM_WORD) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <ConfirmDialog
        open
        title="Eliminar"
        message={
          <>
            ¿Estás seguro de que deseas eliminar {itemLabel}
            {itemName ? (
              <>
                {' '}
                <strong>“{itemName}”</strong>
              </>
            ) : null}
            ?
          </>
        }
        confirmText="Sí, continuar"
        danger
        onConfirm={() => setStep(2)}
        onCancel={onCancel}
      />
    );
  }

  return (
    <Modal
      open
      onClose={loading ? undefined : onCancel}
      title="Confirmación final"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={loading}
            disabled={typed !== CONFIRM_WORD}
          >
            Eliminar permanentemente
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <p className="confirm__msg">
          Esta acción eliminará permanentemente {itemLabel}. Escribe <strong>{CONFIRM_WORD}</strong> para
          confirmar.
        </p>
        <input
          className="input"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={CONFIRM_WORD}
          autoComplete="off"
          aria-label={`Escribe ${CONFIRM_WORD} para confirmar`}
        />
      </form>
    </Modal>
  );
}
