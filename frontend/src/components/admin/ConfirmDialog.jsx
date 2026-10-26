import { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="admin-modal admin-modal--confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-title">{title}</h3>
        <p id="confirm-dialog-desc">{message}</p>
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn--ghost" ref={cancelRef} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-btn ${variant === 'danger' ? 'admin-btn--danger' : 'admin-btn--primary'}`}
            onClick={onConfirm}
            disabled={confirmLabel.includes('…')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
