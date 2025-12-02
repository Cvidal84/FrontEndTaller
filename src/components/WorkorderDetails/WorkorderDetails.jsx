import React from 'react';
import BaseCard from '../BaseCard/BaseCard'; // Importar el BaseCard

function WorkorderFields({ form, isEditing, updateForm }) {
    
    // Función para manejar cambios simples (ej. estado, coste)
    const handleChange = (e) => {
        updateForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- MODO VISUALIZACIÓN ---
    if (!isEditing) {
        return (
            <>
                {/* Usamos form.propiedad para mostrar los datos */}
                <p><strong>Cliente:</strong> {form.clientName}</p>
                <p><strong>Matrícula:</strong> {form.vehiclePlate}</p>
                <p><strong>Estado:</strong> {form.status}</p>
                <p><strong>Descripción:</strong> {form.description}</p>
                <p><strong>Coste estimado:</strong> {form.estimatedCost ?? "N/A"} €</p>
                {/* Puedes añadir más detalles aquí, como la lista de mecánicos asignados */}
            </>
        );
    }
    
    // --- MODO EDICIÓN ---
    return (
        <div className="edit-form">
            <label>Estado:</label>
            <input name="status" value={form.status} onChange={handleChange} />
            
            <label>Coste Estimado (€):</label>
            <input name="estimatedCost" type="number" value={form.estimatedCost} onChange={handleChange} />
            
            <label>Descripción:</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
            
            {/* Opcional: Campos para seleccionar Cliente/Vehículo/Mecánico */}
        </div>
    );
}

// Componente Envoltorio Principal
export default function WorkorderDetailsWrapper({ workorder, onClose, onSave }) {
    
    const title = `Orden de Trabajo #${workorder.orderNumber || 'Nueva'}`; // Asumiendo que tienes un número de orden
    
    return (
        <BaseCard
            title={title}
            initialData={workorder}
            onClose={onClose}
            onSave={onSave}
            // Puedes pasar la fecha de creación en el footer
            footerContent={<p>Creada: {new Date(workorder.createdAt).toLocaleDateString()}</p>}
        >
            {/* 💡 ESTE ES EL CONTENIDO ESPECÍFICO DE LA ORDEN DE TRABAJO */}
            <WorkorderFields /> 
        </BaseCard>
    );
}