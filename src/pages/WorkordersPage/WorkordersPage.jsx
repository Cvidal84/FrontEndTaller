import React, { useEffect, useState } from "react";
// Importamos la función de API que ya tienes
import { getWorkorders, updateWorkorder } from "../../services/api"; 
// 💡 Importamos el componente de detalle
import WorkorderDetails from "../../components/WorkorderDetails/WorkorderDetails"; 
import './WorkordersPage.css';

export default function WorkordersPage() {
    const [workorders, setWorkorders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // Nuevo estado para la orden seleccionada
    const [selectedWorkorder, setSelectedWorkorder] = useState(null); 

    // Cargar lista de órdenes
    useEffect(() => {
        const load = async () => {
            try {
                const data = await getWorkorders();
                setWorkorders(data || []);
            } catch (err) {
                console.error(err);
                setError(err.message || "Error cargando partes de trabajo");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Función para guardar cambios (llama a la API)
    const handleSaveWorkorder = async (updatedWorkorder) => {
        try {
            const workorderFromApi = await updateWorkorder(updatedWorkorder); 

            // Actualizar la lista izquierda
            setWorkorders((prev) =>
                prev.map((wo) => (wo._id === workorderFromApi._id ? workorderFromApi : wo))
            );

            // Actualizar el detalle (BaseCard)
            setSelectedWorkorder(workorderFromApi);

            alert("Orden de trabajo actualizada ✅");
        } catch (err) {
            console.error(err);
            alert("Hubo un error al actualizar la orden ❌");
        }
    };
    
    // Función para manejar la selección de una orden en la lista
    const handleSelectWorkorder = (workorder) => {
        setSelectedWorkorder(workorder); 
    };


    if (loading) return <p>Cargando órdenes de trabajo...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="workorders-layout">
            
            {/* LISTA IZQUIERDA */}
            <div className="workorders-list">
                <h2>Órdenes de trabajo</h2>
                {workorders.length === 0 && <p>No hay órdenes de trabajo.</p>}
                
                <ul className="workorder-list-items">
                    {workorders.map((wo, index) => (
                        <li 
                            key={wo._id} 
                            onClick={() => handleSelectWorkorder(wo)}
                            className="workorder-item"
                        >
                            <h3>Orden de Trabajo #{index + 1}</h3> 
                            
                            {wo.clientId && (
                                <p>
                                    <strong>Cliente:</strong> {wo.clientId.name}
                                </p>
                            )}
                            
                            {/* 🔑 AÑADIDO: Muestra la descripción de la reparación */}
                            {wo.description && (
                                <p>
                                    <strong>Reparación:</strong> {wo.description}
                                </p>
                            )}
                            
                            <strong>Matrícula:</strong> {wo.vehiclePlate}
                            <strong>Estado:</strong> {wo.status}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* PANEL DERECHO (DETALLES) */}
            <div className="workorder-details-panel">
                {selectedWorkorder ? (
                    <WorkorderDetails
                        workorder={selectedWorkorder}
                        onClose={() => setSelectedWorkorder(null)}
                        onSave={handleSaveWorkorder} 
                    />
                ) : (
                    <p>Selecciona una orden de trabajo de la lista</p>
                )}
            </div>
        </div>
    );
}