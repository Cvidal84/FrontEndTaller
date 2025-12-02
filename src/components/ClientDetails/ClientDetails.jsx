import React, { useState } from "react";
import { createVehicle } from "../../services/api";
import BaseCard from "../BaseCard/BaseCard"; 

// 1. Componente que define los campos de Cliente
// (Recibe props internas de BaseCard, como form, isEditing y updateForm)
function ClientFields({ form, isEditing, updateForm }) {
    // Estado para controlar si estamos añadiendo un vehículo
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ plate: "", brand: "", model: "", kms: "" });

    // Función para manejar cambios en el formulario de nuevo vehículo
    const handleNewVehicleChange = (e) => {
        setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
    };

    // Función para guardar el nuevo vehículo
    const handleAddVehicle = async () => {
        if (!newVehicle.plate || !newVehicle.brand || !newVehicle.model) {
            alert("Por favor, rellena todos los campos del vehículo.");
            return;
        }

        // Validación de matrícula española
        const plateRegex = /^(\d{4}[B-DF-HJ-NP-TV-Z]{3}|[A-Z]{1,2}\d{4}[A-Z]{0,2})$/i;
        if (!plateRegex.test(newVehicle.plate)) {
            alert("La matrícula no tiene un formato válido (Ej: 1234BCD o M1234AB)");
            return;
        }

        try {
            // Llamamos a la API para crear el vehículo
            // IMPORTANTE: Asignamos el vehículo al cliente actual (form._id)
            // Aseguramos que la matrícula vaya en mayúsculas
            const vehicleToCreate = { 
                ...newVehicle, 
                plate: newVehicle.plate.toUpperCase(),
                client: form._id 
            };
            const createdVehicle = await createVehicle(vehicleToCreate);

            // Actualizamos la lista de vehículos en el estado local
            // Si form.vehicles no existe, lo inicializamos
            const currentVehicles = form.vehicles || [];
            updateForm({ ...form, vehicles: [...currentVehicles, createdVehicle] });

            // Limpiamos y cerramos el formulario
            setNewVehicle({ plate: "", brand: "", model: "", kms: "" });
            setIsAddingVehicle(false);
            alert("Vehículo añadido correctamente ✅");
        } catch (error) {
            console.error("Error añadiendo vehículo:", error);
            alert("Error al añadir el vehículo ❌");
        }
    };
    
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
                    <button className="add-vehicle-btn" onClick={() => setIsAddingVehicle(!isAddingVehicle)}>
                        {isAddingVehicle ? "Cancelar" : "➕ Añadir Vehículo"}
                    </button>
                    
                    {/* Formulario para añadir vehículo */}
                    {isAddingVehicle && (
                        <div className="add-vehicle-form" style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                            <h4>Nuevo Vehículo</h4>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                <input 
                                    name="plate" 
                                    placeholder="Matrícula" 
                                    value={newVehicle.plate} 
                                    onChange={handleNewVehicleChange}
                                    style={{ flex: 1 }}
                                />
                                <input 
                                    name="brand" 
                                    placeholder="Marca" 
                                    value={newVehicle.brand} 
                                    onChange={handleNewVehicleChange} 
                                    style={{ flex: 1 }}
                                />
                                <input 
                                    name="model" 
                                    placeholder="Modelo" 
                                    value={newVehicle.model} 
                                    onChange={handleNewVehicleChange} 
                                    style={{ flex: 1 }}
                                />
                                <input 
                                    name="kms" 
                                    type="number"
                                    placeholder="Kms" 
                                    value={newVehicle.kms || ""} 
                                    onChange={handleNewVehicleChange} 
                                    style={{ flex: 0.5 }}
                                />
                            </div>
                            <button onClick={handleAddVehicle} style={{ marginTop: '5px' }}>Guardar Vehículo</button>
                        </div>
                    )}
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