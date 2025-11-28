import { useState } from "react";
import "./ClientCard.css";


export default function ClientCard({ client, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(client);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSave = () => {
    onSave(form); // Llamar a ClientsPage para guardar
    setIsEditing(false); // Salir del modo edición
  };

  return (
    <div className="client-card">
      
      {/* TÍTULO (Mantenemos el título arriba) */}
      <h2>{isEditing ? "Editar Cliente" : client.name}</h2>

      {/* 1. MODO VISUALIZACIÓN DE DATOS (NO BOTONES) */}
      {!isEditing && (
        <>
          <p><strong>📞 Teléfono:</strong> {client.telephone}</p>
          {client.email && <p><strong>📧 Email:</strong> {client.email}</p>}

          {client.address && (
            <>
              <p><strong>📍 Dirección:</strong></p>
              <p>{client.address.street}</p>
              <p>{client.address.city} ({client.address.zip})</p>
              <p>{client.address.country}</p>
            </>
          )}
        </>
      )}

      {/* 2. MODO EDICIÓN DEL FORMULARIO */}
      {isEditing && (
        <div className="edit-form">

          <label>Nombre:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Teléfono:</label>
          <input
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <label>Dirección:</label>
          <input
            name="street"
            placeholder="Calle"
            value={form.address?.street || ""}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, street: e.target.value },
              })
            }
          />

          <input
            name="city"
            placeholder="Ciudad"
            value={form.address?.city || ""}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, city: e.target.value },
              })
            }
          />

          <input
            name="zip"
            placeholder="Código Postal"
            value={form.address?.zip || ""}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, zip: e.target.value },
              })
            }
          />

          <input
            name="country"
            placeholder="País"
            value={form.address?.country || ""}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, country: e.target.value },
              })
            }
          />
        </div>
      )}

      {/* 3. BOTONES DE ACCIÓN (AHORA AL FINAL) */}
      <div className="client-buttons">
        
        {/* BOTÓN CERRAR (Siempre visible) */}
        <button className="close-btn" onClick={onClose}>X</button>
        
        {/* BOTONES EN MODO VISUALIZACIÓN */}
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Editar cliente
          </button>
        )}
        
        {/* BOTONES EN MODO EDICIÓN */}
        {isEditing && (
          <>
            <button className="save-btn" onClick={handleSave}>
              💾 Guardar
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}