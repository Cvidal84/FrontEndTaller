// src/components/BaseCard.jsx

import React, { useState } from "react";
import Button from "../Button/Button"; // Usamos tu componente Button
import "./BaseCard.css"; // Estilos para el contenedor

export default function BaseCard({
  title,
  initialData,
  onClose,
  onSave,
  children,
  footerContent,
  initialIsEditing = false,
}) {
  const [isEditing, setIsEditing] = useState(initialIsEditing);

  // Estado del formulario
  const [form, setForm] = useState(initialData);

  // Estado auxiliar para rastrear cambios en initialData (props)
  const [prevInitialDataString, setPrevInitialDataString] = useState(
    JSON.stringify(initialData)
  );

  // ✅ CORRECCIÓN ESLINT: Patrón "Adjusting state during rendering"
  // Comparamos si los datos nuevos son diferentes a los que teníamos guardados.
  const currentDataString = JSON.stringify(initialData);

  if (currentDataString !== prevInitialDataString) {
    // Si son diferentes, actualizamos el estado INMEDIATAMENTE.
    // React detecta esto, cancela el render actual y re-renderiza con los nuevos datos
    // sin esperar a que se pinte la pantalla (evitando parpadeos y useEffects).
    setPrevInitialDataString(currentDataString);
    setForm(initialData);
  }

  const updateForm = (newFormData) => {
    setForm(newFormData);
  };

  const handleSave = () => {
    onSave(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(initialData);
    setIsEditing(false);
  };

  return (
    <div
      className="base-card"
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        background: "#fff",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>{isEditing ? `Editar: ${title}` : title}</h2>
        <Button
          variant="icon-danger"
          onClick={onClose}
          style={{ marginLeft: "auto", fontSize: "1.2rem", padding: "0" }}
        >
          ✕
        </Button>
      </div>

      <div className="card-content-area" style={{ flex: 1, overflowY: "auto" }}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            isEditing,
            form,
            updateForm,
          })
        )}
      </div>

      <div
        className="card-actions"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: "10px",
          borderTop: "1px solid #eee",
        }}
      >
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}

        {isEditing && (
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              💾 Guardar
            </Button>
          </>
        )}
      </div>

      {footerContent && <div className="card-footer">{footerContent}</div>}
    </div>
  );
}
