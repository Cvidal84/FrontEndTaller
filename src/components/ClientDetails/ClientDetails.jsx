import React from "react";
import BaseCard from "../BaseCard/BaseCard"; 

// 1. Componente que define los campos de Cliente
// (Recibe props internas de BaseCard, como form, isEditing y updateForm)
function ClientFields({ form, isEditing, updateForm }) {
    
    // Función para manejar campos simples (nombre, teléfono, email)
    const handleChange = (e) => {
        // Llama a la función del BaseCard para actualizar el estado central
        updateForm({ ...form, [e.target.name]: e.target.value });
    };

    // Función para manejar los campos anidados de Dirección
    const handleAddressChange = (e) => {
        updateForm({
            ...form,
            address: { ...form.address, [e.target.name]: e.target.value },
        });
    };

    // --- RENDERIZADO CONDICIONAL DE CAMPOS ---
    
    // MODO VISUALIZACIÓN
    if (!isEditing) {
        return (
            <>
                <p><strong>📞 Teléfono:</strong> {form.telephone}</p>
                {form.email && <p><strong>📧 Email:</strong> {form.email}</p>}

                {form.address && (
                    <>
                        <p><strong>📍 Dirección:</strong></p>
                        <p>{form.address.street}</p>
                        <p>{form.address.city} ({form.address.zip})</p>
                        <p>{form.address.country}</p>
                    </>
                )}
                
                {/* * Sección de Vehículos (se mantiene aquí, ya que es contenido del cliente) 
                 * Esto es lo que va DENTRO del BaseCard en modo visualización
                 */}
                <div className="client-vehicles-section">
                    <h3>Vehículos</h3>
                    {form.vehicles && form.vehicles.length > 0 ? (
                        <ul className="vehicle-list">
                            {form.vehicles.map((v, index) => (
                                <li key={v._id || index} className="vehicle-item">
                                    <strong>{v.plate}</strong> — {v.brand} {v.model}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">No hay vehículos registrados.</p>
                    )}
                    <button className="add-vehicle-btn">➕ Añadir Vehículo</button>
                </div>
            </>
        );
    }
    
    // MODO EDICIÓN (FORMULARIO)
    return (
        <div className="edit-form">
            <label>Nombre:</label>
            <input name="name" value={form.name} onChange={handleChange} />

            <label>Teléfono:</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} />

            <label>Email:</label>
            <input name="email" value={form.email} onChange={handleChange} />

            <label>Dirección:</label>
            <input name="street" placeholder="Calle" value={form.address?.street || ""} onChange={handleAddressChange}/>
            <input name="city" placeholder="Ciudad" value={form.address?.city || ""} onChange={handleAddressChange}/>
            <input name="zip" placeholder="Código Postal" value={form.address?.zip || ""} onChange={handleAddressChange}/>
            <input name="country" placeholder="País" value={form.address?.country || ""} onChange={handleAddressChange}/>
        </div>
    );
}


// 2. Componente Envoltorio Principal (el que se exporta)
export default function ClientDetailsWrapper({ client, onClose, onSave }) {
    
    const title = client.name || "Nuevo Cliente";
    
    return (
        <BaseCard
            title={title}
            initialData={client}
            onClose={onClose}
            onSave={onSave}
        >
            {/* 💡 ClientFields es el contenido que BaseCard va a renderizar condicionalmente */}
            <ClientFields /> 
        </BaseCard>
    );
}