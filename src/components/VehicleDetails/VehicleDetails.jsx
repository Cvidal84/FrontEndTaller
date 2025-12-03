import React, { useState, useEffect } from 'react';
import { getClients } from '../../services/api';
import BaseCard from '../BaseCard/BaseCard'; 

// --- 1. COMPONENTE INTERNO: CAMPOS DEL VEHÍCULO ---
function VehicleFields({ form, isEditing, updateForm }) {
    const [clients, setClients] = useState([]);
    
    useEffect(() => {
        if (isEditing) {
            // Cargar clientes para el desplegable
            // NOTA: Por ahora cargamos la primera página. 
            // Idealmente deberíamos tener un buscador o cargar todos si no son muchos.
            getClients().then(data => {
                setClients(data.clients || []);
            }).catch(err => console.error("Error cargando clientes", err));
        }
    }, [isEditing]);

    const handleChange = (e) => {
        updateForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClientChange = (e) => {
        const selectedClientId = e.target.value;
        const selectedClient = clients.find(c => c._id === selectedClientId);
        // Actualizamos con el objeto completo para que la UI (modo visualización) siga funcionando
        updateForm({ ...form, clientId: selectedClient });
    };

    // --- MODO VISUALIZACIÓN ---
    if (!isEditing) {
        return (
            <>
                {/* Información del Cliente Asociado (si existe y está poblado) */}
                {form.clientId && form.clientId.name && (
                    <div className="client-info-section">
                        <h3>Cliente Asociado</h3>
                        <p><strong>👤 Nombre:</strong> {form.clientId.name}</p>
                        <p><strong>📞 Teléfono:</strong> {form.clientId.telephone}</p>
                        <hr />
                    </div>
                )}
                
                <p><strong>Matrícula:</strong> {form.plate}</p>
                <p><strong>Marca:</strong> {form.brand}</p>
                <p><strong>Modelo:</strong> {form.model}</p>
                <p><strong>Kms:</strong> {form.kms ?? "N/D"}</p>
            </>
        );
    }
    
    // --- MODO EDICIÓN ---
    return (
        <div className="edit-form">
            <label>Cliente:</label>
            <select 
                name="clientId" 
                value={form.clientId?._id || ""} 
                onChange={handleClientChange}
            >
                <option value="">-- Seleccionar Cliente --</option>
                {clients.map(client => (
                    <option key={client._id} value={client._id}>
                        {client.name} {client.telephone ? `(${client.telephone})` : ''}
                    </option>
                ))}
            </select>
            
            <label>Matrícula:</label>
            <input name="plate" value={form.plate} onChange={handleChange} />
            
            <label>Marca:</label>
            <input name="brand" value={form.brand} onChange={handleChange} />
            
            <label>Modelo:</label>
            <input name="model" value={form.model} onChange={handleChange} />
            
            <label>Kms:</label>
            <input name="kms" type="number" value={form.kms || ""} onChange={handleChange} />
        </div>
    );
}

// --- 2. COMPONENTE ENVOLTORIO PRINCIPAL (WRAPPER) ---
export default function VehicleDetails({ vehicle, onClose, onSave }) {
    
    const title = `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}`; 
    
    return (
        <BaseCard
            title={title}
            initialData={vehicle}
            onClose={onClose}
            onSave={onSave}
            footerContent={<p>Creado: {new Date(vehicle.createdAt).toLocaleDateString()}</p>}
        >
            <VehicleFields /> 
        </BaseCard>
    );
}
