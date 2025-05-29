"use client";
import React, { useEffect, useState } from "react";
import styles from "./Errors.module.scss";
import { useInterfaceStore } from "@/state/interface";

const Errors = () => {
  const { errors, removeError } = useInterfaceStore((state) => state);
  const [visibleErrors, setVisibleErrors] = useState(errors);

  useEffect(() => {
    setVisibleErrors(errors);

    const timers = errors.map((error: any) =>
      setTimeout(() => {
        removeError(error.id);
      }, error.duration || 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [errors, removeError]);

  const handleClose = (id: string) => {
    removeError(id);
  };

  return (
    <div className={styles.container}>
      {visibleErrors.map((error: any) => (
        <div
          key={error.id}
          className={`${styles.alert} ${styles[error.type || "info"]}`}
        >
          <span className={styles.icon}>!</span>
          <span className={styles.message}>{error.message}</span>
          <button
            onClick={() => handleClose(error.id)}
            className={styles.close}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Errors;
