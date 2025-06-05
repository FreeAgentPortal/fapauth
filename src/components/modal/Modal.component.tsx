// components/ui/CustomModal.tsx
import React from 'react';
import styles from './Modal.module.scss';

type Props = {
  open: boolean;
  children: React.ReactNode;
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  footer?: React.ReactNode;
};

const Modal = ({ open, children, closable = true, maskClosable = true, centered = true, footer = null }: Props) => {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={maskClosable ? () => {} : undefined}>
      <div className={`${styles.modal} ${centered ? styles.centered : ''}`} onClick={(e) => e.stopPropagation()}>
        {closable && <button className={styles.closeBtn}>&times;</button>}
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
