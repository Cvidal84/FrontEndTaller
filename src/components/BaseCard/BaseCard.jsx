// src/components/BaseCard.jsx

import React, { useState } from 'react';
import Button from "../Button/Button"; // Usamos tu componente Button
import './BaseCard.css'; // Estilos para el contenedor

export default function BaseCard({ 
    title,          // Título de la tarjeta 
    initialData,    // Objeto inicial (cliente, vehículo...)
    onClose,        // Función para cerrar la tarjeta (la "X")
    onSave,         // Función que llama a la API para guardar
    children,       // El contenido específico que debe mostrarse DENTRO del marco
    footerContent,  // Contenido opcional bajo los botones
    initialIsEditing = false, // Nuevo prop para iniciar en modo edición
}) {
    // 💡 El estado y el modo de edición se gestionan aquí
    const [isEditing, setIsEditing] = useState(initialIsEditing);
    // Usamos un estado interno para el formulario, basado en la data inicial
    const [form, setForm] = useState(initialData); 

    // Esta función la pasa BaseCard a los componentes hijos para que actualicen el estado 'form'
    const updateForm = (newFormData) => {
        setForm(newFormData);
    };

    const handleSave = () => {
        onSave(form); // Llama a la prop onSave con los datos modificados
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setForm(initialData); // Restaura el formulario a los datos iniciales
        setIsEditing(false);
    };

    return (
        <div className="base-card">
            
            {/* TÍTULO */}
            <h2>{isEditing ? `Editar: ${title}` : title}</h2>
            
            {/* 1. CONTENIDO CENTRAL (CLIENTE, VEHÍCULO, ETC.) */}
            <div className="card-content-area">
                {/* * Renderizamos los hijos, pasándoles el estado y las funciones 
                 * necesarias para que actualicen los inputs y muestren la data.
                 */}
                {React.Children.map(children, child =>
                    React.cloneElement(child, {
                        isEditing,
                        form,
                        updateForm,
                    })
                )}
            </div>

            {/* 2. BOTONES DE ACCIÓN */}
            <div className="card-actions">
                
                {/* MODO VISUALIZACIÓN */}
                {!isEditing && (
                    <Button variant="secondary" onClick={() => setIsEditing(true)}>
                        Editar
                    </Button>
                )}
                
                {/* MODO EDICIÓN */}
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

                {/* BOTÓN CERRAR (siempre visible, al final) */}
                <Button variant="icon-danger" onClick={onClose} style={{ marginLeft: 'auto' }}>
                    X
                </Button>
            </div>
            
            {footerContent && <div className="card-footer">{footerContent}</div>}
        </div>
    );
}