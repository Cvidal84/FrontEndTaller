import { useState } from "react";

export default function ClientCard({ client, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(client);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="client-card">
      <button className="close-btn" onClick={onClose}>X</button>

      {/* 🔵 TÍTULO */}
      <h2>{isEditing ? "Editar Cliente" : client.name}</h2>

      {/* 🔵 BOTÓN EDITAR */}
      {!isEditing && (
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          ✏️ Editar cliente
        </button>
      )}

      {/* 🟢 MODO EDICIÓN */}
      {isEditing ? (
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

          {/* 🟢 BOTÓN GUARDAR */}
          <button
            className="save-btn"
            onClick={() => {
              onSave(form); // llamar a ClientsPage para guardar
              setIsEditing(false);
            }}
          >
            💾 Guardar cambios
          </button>
        </div>
      ) : (
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
    </div>
  );
}
