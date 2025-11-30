import { useState } from "react";
import "./ClientCard.css";
import Button from "../Button/Button";


export default function ClientCard({ client, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(client);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    onSave(form);
    setIsEditing(false);
  };
  

  const handleAddressChange = (e) => {
    setForm({
      ...form,
      address: { ...form.address, [e.target.name]: e.target.value },
    });
  };

  return (
    <div className="client-card">
      
      <h2>{isEditing ? "Editar Cliente" : client.name}</h2>

      
      {!isEditing && (
        <>
          <p>
            <strong>📞 Teléfono:</strong> {client.telephone}
          </p>
          {client.email && (
            <p>
              <strong>📧 Email:</strong> {client.email}
            </p>
          )}

          {client.address && (
            <>
              <p>
                <strong>📍 Dirección:</strong>
              </p>
              <p>{client.address.street}</p>
              <p>
                {client.address.city} ({client.address.zip})
              </p>
              <p>{client.address.country}</p>
            </>
          )}

          
          <div className="client-vehicles-section">
            <h3>Vehículos</h3>

            
            {client.vehicles && client.vehicles.length > 0 ? (
              <ul className="vehicle-list">
                {client.vehicles.map((v, index) => (
                  <li key={v._id || index} className="vehicle-item">
                    <strong>{v.plate}</strong> — {v.brand} {v.model}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No hay vehículos registrados.</p>
            )}

            
            <Button
              variant="secondary"
              className="add-vehicle-btn"
              
            >
              ➕ Añadir Vehículo
            </Button>
          </div>
        </>
      )}

      
      {isEditing && (
        <div className="edit-form">
          <label>Nombre:</label>
          <input name="name" value={form.name} onChange={handleChange} />

          <label>Teléfono:</label>
          <input
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} />

          <label>Dirección:</label>
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
            placeholder="Código Postal"
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
      )}

      
      <div className="client-buttons">

        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Editar cliente
          </Button>
        )}
       

        {isEditing && (
          <>
            <Button variant="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
          </>
        )}
        {/* intento poner el boton x al final siempre, simulando windows */}
        <Button variant="danger" onClick={onClose}>
          X
        </Button>
      </div>
    </div>
  );
}