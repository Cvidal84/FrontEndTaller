import React from 'react';
import BaseCard from '../BaseCard/BaseCard'; 

// --- 1. COMPONENTE INTERNO: CAMPOS DE LA ORDEN DE TRABAJO ---
function WorkorderFields({ form, isEditing, updateForm }) {
    
    // Función para manejar cambios simples (ej. estado, coste)
    const handleChange = (e) => {
        updateForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- MODO VISUALIZACIÓN ---
    if (!isEditing) {
        return (
            <>
                {/* 🔑 CLAVE: Muestra la información del CLIENTE (que viene en form.clientId) */}
                {form.clientId && (
                    <div className="client-info-section">
                        <h3>Cliente Asociado</h3>
                        <p><strong>👤 Nombre:</strong> {form.clientId.name}</p>
                        <p><strong>📞 Teléfono:</strong> {form.clientId.telephone}</p>
                        {form.clientId.email && <p><strong>📧 Email:</strong> {form.clientId.email}</p>}
                        <hr />
                    </div>
                )}
                
                {/* Información del Vehículo (asumimos que está en vehicleId) */}
                {form.vehicleId && (
                    <p><strong>Matrícula:</strong> {form.vehicleId.plate} ({form.vehicleId.brand} {form.vehicleId.model})</p>
                )}

                <p><strong>Estado:</strong> {form.status}</p>
                <p><strong>Descripción:</strong> {form.description}</p>
                <p><strong>Coste estimado:</strong> {form.estimatedCost ?? "N/A"} €</p>
            </>
        );
    }
    
    // --- MODO EDICIÓN ---
    return (
        <div className="edit-form">
            {/* Cliente en modo de solo lectura */}
            {form.clientId && <p>Cliente: {form.clientId.name}</p>} 
            
            <label>Estado:</label>
            <select name="status" value={form.status} onChange={handleChange}>
                {["Pendiente", "En proceso", "Completada", "Cancelada"].map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            
            <label>Coste Estimado (€):</label>
            <input name="estimatedCost" type="number" value={form.estimatedCost || 0} onChange={handleChange} />
            
            <label>Descripción:</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
            
            {/* Aquí irían otros campos editables si los necesitas */}
        </div>
    );
}

// --- 2. COMPONENTE ENVOLTORIO PRINCIPAL (WRAPPER) ---
export default function WorkorderDetails({ workorder, onClose, onSave, customOrderNumber, initialIsEditing = false }) {
    
    // El título de la tarjeta
    // Si viene customOrderNumber (calculado en la lista), lo usamos. Si no, fallback al snapshot.
    const title = `Orden #${customOrderNumber || workorder.snapshot?.orderNumber || 'Nueva'}`; 
    
    return (
        <BaseCard
            title={title}
            initialData={workorder} // El objeto completo de la orden
            onClose={onClose}
            onSave={onSave}
            footerContent={<p>Creada: {new Date(workorder.createdAt).toLocaleDateString()}</p>}
            initialIsEditing={initialIsEditing}
        >
            {/* Pasamos el componente de campos como hijo del BaseCard */}
            <WorkorderFields /> 
        </BaseCard>
    );
}