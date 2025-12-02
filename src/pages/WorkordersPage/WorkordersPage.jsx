import React, { useEffect, useState } from "react";
import { getWorkorders, updateWorkorder, getWorkorderById, createWorkorder } from "../../services/api";
import WorkorderDetails from "../../components/WorkOrderDetails/WorkorderDetails";
import './WorkordersPage.css';

export default function WorkordersPage() {
    const [workorders, setWorkorders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedWorkorder, setSelectedWorkorder] = useState(null);
    
    // Estados para búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // EFECTO PRINCIPAL: Carga órdenes cuando cambia la página o la búsqueda
    useEffect(() => {
        const timeOutId = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getWorkorders(page, searchTerm);
                // La API devuelve { workorders: [], pagination: {} }
                setWorkorders(data.workorders || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } catch (err) {
                console.error(err);
                setError(err.message || "Error cargando partes de trabajo");
            } finally {
                setLoading(false);
            }
        }, 500); // Debounce

        return () => clearTimeout(timeOutId);
    }, [page, searchTerm]);

    // MANEJAR EL INPUT DE BÚSQUEDA
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset a página 1 al buscar
    };

    // MANEJAR SELECCIÓN DE ORDEN
    const handleSelectWorkorder = async (basicWorkorder) => {
        setSelectedWorkorder(basicWorkorder);
        try {
            // Pedimos detalles completos (si fuera necesario, aunque workorder ya suele traer casi todo)
            // Pero mantenemos el patrón de ClientsPage por si acaso el backend no manda todo en la lista
            const fullWorkorderData = await getWorkorderById(basicWorkorder._id);
            
            setSelectedWorkorder((currentSelection) => {
                if (currentSelection?._id === basicWorkorder._id) {
                    return fullWorkorderData;
                }
                return currentSelection;
            });
        } catch (error) {
            console.error("Error cargando detalles de la orden", error);
        }
    };

    // MANEJAR CREACIÓN DE NUEVA ORDEN
    const handleCreateWorkorder = () => {
        // Creamos un objeto vacío o con valores por defecto
        const newWorkorder = {
            status: 'Abierta',
            description: '',
            estimatedCost: 0,
            createdAt: new Date().toISOString(), // Para que no falle la fecha en el footer
            snapshot: { orderNumber: 'Nueva' }
        };
        setSelectedWorkorder(newWorkorder);
    };

    // GUARDAR CAMBIOS (CREAR O ACTUALIZAR)
    const handleSaveWorkorder = async (workorderData) => {
        try {
            let savedWorkorder;
            
            if (workorderData._id) {
                // ACTUALIZAR
                savedWorkorder = await updateWorkorder(workorderData);
                
                // Actualizar la lista izquierda
                setWorkorders((prev) =>
                    prev.map((wo) => (wo._id === savedWorkorder._id ? savedWorkorder : wo))
                );
                alert("Orden de trabajo actualizada ✅");
            } else {
                // CREAR
                savedWorkorder = await createWorkorder(workorderData);
                
                // Añadir a la lista (al principio) y resetear paginación si quieres verla
                // O simplemente recargar la lista actual
                setWorkorders((prev) => [savedWorkorder, ...prev]);
                alert("Orden de trabajo creada ✅");
            }

            // Actualizar el detalle con la respuesta del servidor (que tendrá _id real)
            setSelectedWorkorder(savedWorkorder);

        } catch (err) {
            console.error(err);
            alert("Hubo un error al guardar la orden ❌");
        }
    };

    return (
        <div className="workorders-layout">
            
            {/* LISTA IZQUIERDA */}
            <div className="workorders-list">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Órdenes de trabajo</h2>
                    <button 
                        onClick={handleCreateWorkorder}
                        className="create-workorder-btn"
                        title="Crear nueva orden"
                    >
                        + Nueva
                    </button>
                </div>
                
                {/* INPUT DE BÚSQUEDA */}
                <input
                    type="text"
                    placeholder="Buscar por cliente, matrícula, descripción..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && workorders.length === 0 && <p>No se encontraron órdenes.</p>}
                
                {!loading && (
                    <ul className="workorder-list-items">
                        {workorders.map((wo, index) => {
                            // CÁLCULO DEL NÚMERO INCREMENTAL
                            // (Página actual - 1) * 10 items por página + índice actual + 1
                            const displayNumber = (page - 1) * 10 + index + 1;
                            
                            return (
                                <li 
                                    key={wo._id} 
                                    onClick={() => handleSelectWorkorder(wo)}
                                    className={`workorder-item ${selectedWorkorder?._id === wo._id ? "active" : ""}`}
                                >
                                    <div className="workorder-avatar">
                                        #{displayNumber}
                                    </div>
                                    <div className="workorder-main">
                                        <span className="workorder-title">
                                            {wo.vehicleId?.plate || "Sin Vehículo"} - {wo.clientId?.name || "Sin Cliente"}
                                        </span>
                                        <span className="workorder-status">{wo.status}</span>
                                        {wo.description && (
                                            <span className="workorder-desc">
                                                {wo.description.substring(0, 30)}...
                                            </span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* PAGINACIÓN */}
                {workorders.length > 0 && (
                    <div className="pagination-controls">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            ◀︎
                        </button>
                        <span>{page}/{totalPages || 1}</span>
                        <button
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            ▶︎
                        </button>
                    </div>
                )}
            </div>
            
            {/* PANEL DERECHO (DETALLES) */}
            <div className="workorder-details-panel">
                {selectedWorkorder ? (
                    <WorkorderDetails
                        key={selectedWorkorder._id || 'new'} // Clave única para forzar remontaje al crear
                        workorder={selectedWorkorder}
                        // Pasamos el número calculado. 
                        // OJO: Necesitamos recalcularlo para el seleccionado si no lo guardamos en el estado.
                        // Una forma fácil es buscarlo en la lista actual o pasarlo al seleccionar.
                        // Pero como selectedWorkorder es un objeto, podemos inyectarle la propiedad o pasarla aparte.
                        // Aquí lo recalcularemos buscando el índice en la lista actual (si está en la página actual).
                        // Si no está (ej. recarga), habría que ver. Por ahora asumimos navegación normal.
                        customOrderNumber={
                            workorders.findIndex(w => w._id === selectedWorkorder._id) !== -1 
                            ? (page - 1) * 10 + workorders.findIndex(w => w._id === selectedWorkorder._id) + 1
                            : undefined
                        }
                        onClose={() => setSelectedWorkorder(null)}
                        onSave={handleSaveWorkorder} 
                        initialIsEditing={!selectedWorkorder._id} // Si no tiene ID, es nuevo -> modo edición
                    />
                ) : (
                    <p>Selecciona una orden de trabajo de la lista o crea una nueva.</p>
                )}
            </div>
        </div>
    );
}