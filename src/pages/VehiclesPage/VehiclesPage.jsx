import { useEffect, useState } from "react";
import { getVehicles, getVehicleById, updateVehicle } from "../../services/api";
import VehicleDetails from "../../components/VehicleDetails/VehicleDetails";
import VehicleModal from "../../components/Vehicles/VehicleModal";
import "./VehiclesPage.css";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NUEVO: Estado para forzar recarga de la lista
  const [refreshKey, setRefreshKey] = useState(0);

  // EFECTO PRINCIPAL: Carga vehículos
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getVehicles(page, searchTerm);
        setVehicles(data.vehicles || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Error cargando vehículos");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeOutId);
    // Añadimos 'refreshKey' a las dependencias para recargar cuando cambie
  }, [page, searchTerm, refreshKey]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Función que pasaremos al modal para cuando termine de crear
  const handleVehicleCreated = () => {
    // Incrementamos el contador para disparar el useEffect
    setRefreshKey((prev) => prev + 1);
  };

  // MANEJAR SELECCIÓN DE VEHÍCULO
  const handleSelectVehicle = async (basicVehicle) => {
    setSelectedVehicle(basicVehicle);
    try {
      const fullVehicleData = await getVehicleById(basicVehicle._id);
      const fullVehicle = fullVehicleData.vehicle || fullVehicleData;

      setSelectedVehicle((currentSelection) => {
        if (currentSelection?._id === basicVehicle._id) {
          if (
            typeof fullVehicle.client === "string" &&
            typeof basicVehicle.client === "object"
          ) {
            return { ...fullVehicle, client: basicVehicle.client };
          }
          return fullVehicle;
        }
        return currentSelection;
      });
    } catch (error) {
      console.error("Error cargando detalles del vehículo", error);
    }
  };

  // GUARDAR CAMBIOS (EDICIÓN)
  const handleSaveVehicle = async (updatedVehicle) => {
    try {
      const payload = { ...updatedVehicle };
      if (payload.client && typeof payload.client === "object") {
        payload.client = payload.client._id;
      }

      const savedVehicle = await updateVehicle(payload);

      if (
        typeof savedVehicle.client === "string" &&
        typeof updatedVehicle.client === "object"
      ) {
        savedVehicle.client = updatedVehicle.client;
      }

      setVehicles((prev) =>
        prev.map((v) => (v._id === savedVehicle._id ? savedVehicle : v))
      );

      setSelectedVehicle(savedVehicle);
      alert("Vehículo actualizado correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al actualizar el vehículo ❌");
    }
  };

  return (
    <div className="vehicles-layout">
      {/* LISTA IZQUIERDA */}
      <div className="vehicles-list">
        {/* CABECERA MEJORADA */}
        <div className="vehicles-header">
          <h2 style={{ margin: 0 }}>Vehículos</h2>
          <button
            className="add-btn"
            onClick={() => setIsModalOpen(true)}
            title="Añadir Vehículo Nuevo"
          >
            ⊕
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por matrícula, marca..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && vehicles.length === 0 && (
          <p>No se encontraron vehículos.</p>
        )}

        {/* LISTA DE ITEMS */}
        {!loading && (
          <ul className="vehicles-list-items">
            {vehicles.map((v) => (
              <li
                key={v._id}
                onClick={() => handleSelectVehicle(v)}
                className={`vehicle-item ${
                  selectedVehicle?._id === v._id ? "active" : ""
                }`}
              >
                <div className="vehicle-avatar">
                  {v.brand?.charAt(0).toUpperCase()}
                </div>
                <div className="vehicle-main">
                  <span className="vehicle-plate">{v.plate}</span>
                  <span className="vehicle-model">
                    {v.brand} {v.model}
                  </span>
                  <span className="vehicle-client">
                    👤 {v.client?.name || "Sin Dueño"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* PAGINACIÓN */}
        {!loading && vehicles.length > 0 && (
          <div
            className="pagination-controls"
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              paddingTop: "10px",
              borderTop: "1px solid #eee",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              style={{ cursor: "pointer", padding: "5px 10px" }}
            >
              ◀︎
            </button>

            <span style={{ alignSelf: "center", fontSize: "0.9rem" }}>
              {page}/{totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              style={{ cursor: "pointer", padding: "5px 10px" }}
            >
              ▶︎
            </button>
          </div>
        )}
      </div>

      {/* PANEL DERECHO (DETALLES) */}
      <div className="vehicle-details">
        {selectedVehicle ? (
          <VehicleDetails
            key={selectedVehicle._id}
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            onSave={handleSaveVehicle}
          />
        ) : (
          <div>
            <p>Selecciona un vehículo de la lista</p>
          </div>
        )}
      </div>

      {/* --- AQUÍ RENDERIZAMOS EL MODAL --- */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialClientId={null} // No hay cliente preseleccionado
        onSuccess={handleVehicleCreated} // Refrescar lista
      />
    </div>
  );
}
