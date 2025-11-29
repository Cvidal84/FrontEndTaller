import React from 'react';
import './Button.css'; // Archivo CSS para los estilos


export default function Button({ 
    variant = 'primary', 
    disabled = false, 
    onClick, 
    children, 
    type = 'button',
    ...props 
}) {
    return (
        <button
            className={`btn btn-${variant}`}
            disabled={disabled}
            onClick={onClick}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}