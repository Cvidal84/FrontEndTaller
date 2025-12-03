import React, { useState } from "react";
import BaseCard from "../BaseCard/BaseCard";
import VehicleModal from "../Vehicles/VehicleModal";
import { getClientById } from "../../services/api";

// --- COMPONENTE INTERNO ---
function ClientFields({ form, isEditing, updateForm }) {
  // Solo necesitamos estado para abrir/cerrar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Maneja cambios normales del cliente
  const handleChange = (e) => {
    updateForm({ ...form, [e.target.name]: e.target.value });
  };

  // Maneja cambios de dirección
  const handleAddressChange = (e) => {
    updateForm({
      ...form,
      address: { ...form.address, [e.target.name]: e.target.value },
    });
  };

  // --- CALLBACK DE ÉXITO ---
  // Esta función se ejecuta cuando el modal termina de crear el coche
  const handleVehicleCreated = async () => {
    try {
      // 1. Pedimos al servidor los datos frescos del cliente (que ya incluirán el coche nuevo)
      const updatedClientData = await getClientById(form._id);
      // 2. Actualizamos el formulario para que se pinte la nueva lista
      updateForm(updatedClientData);
    } catch (error) {
      console.error("Error al refrescar cliente", error);
    }
  };

  // --- RENDERIZADO (MODO LECTURA) ---
  if (!isEditing) {
    return (
      <>
        <div className="client-info">
          <p>
            <strong>📞 Teléfono:</strong> {form.telephone}
          </p>
          {form.email && (
            <p>
              <strong>📧 Email:</strong> {form.email}
            </p>
          )}

          {form.address && (
            <div style={{ marginTop: "10px" }}>
              <p>
                <strong>📍 Dirección:</strong>
              </p>
              <p>{form.address.street}</p>
              <p>
                {form.address.city} ({form.address.zip})
              </p>
              <p>{form.address.country}</p>
            </div>
          )}
        </div>

        {/* SECCIÓN VEHÍCULOS */}
        <div
          className="client-vehicles-section"
          style={{
            marginTop: "20px",
            borderTop: "1px solid #eee",
            paddingTop: "10px",
          }}
        >
          <h3>Vehículos</h3>

          {form.vehicles && form.vehicles.length > 0 ? (
            <ul className="vehicle-list">
              {form.vehicles.map((v, index) => (
                <li
                  key={v._id || index}
                  style={{ padding: "5px 0", borderBottom: "1px dashed #eee" }}
                >
                  <strong>{v.plate}</strong> — {v.brand} {v.model} ({v.kms} km)
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#777", fontStyle: "italic" }}>
              No hay vehículos registrados.
            </p>
          )}

          {/* BOTÓN PARA ABRIR EL MODAL */}
          <button
            className="add-vehicle-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              marginTop: "15px",
              cursor: "pointer",
              padding: "8px 12px",
            }}
          >
            ➕ Añadir Vehículo
          </button>

          {/* INTEGRACIÓN DEL MODAL */}
          <VehicleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialClientId={form._id} // ID para asociar automáticamente
            onSuccess={handleVehicleCreated} // Refrescar lista al terminar
          />
        </div>
      </>
    );
  }

  // --- RENDERIZADO (MODO EDICIÓN DATOS CLIENTE) ---
  return (
    <div className="edit-form">
      <label>Nombre:</label>
      <input name="name" value={form.name} onChange={handleChange} />

      <label>Teléfono:</label>
      <input name="telephone" value={form.telephone} onChange={handleChange} />

      <label>Email:</label>
      <input name="email" value={form.email} onChange={handleChange} />

      <h4>Dirección</h4>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <input
          name="street"
          placeholder="Calle"
          value={form.address?.street || ""}
          onChange={handleAddressChange}
        />
        <input
          name="city"
          placeholder="Ciudad"
          value={form.address?.city || ""}
          onChange={handleAddressChange}
        />
        <input
          name="zip"
          placeholder="CP"
          value={form.address?.zip || ""}
          onChange={handleAddressChange}
        />
        <input
          name="country"
          placeholder="País"
          value={form.address?.country || ""}
          onChange={handleAddressChange}
        />
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL EXPORTADO
export default function ClientDetails({ client, onClose, onSave }) {
  const title = client.name || "Nuevo Cliente";

  return (
    <BaseCard
      title={title}
      initialData={client}
      onClose={onClose}
      onSave={onSave}
    >
      <ClientFields />
    </BaseCard>
  );
}
