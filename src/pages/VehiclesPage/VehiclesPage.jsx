import { useEffect, useState } from "react";
import { getVehicles, getVehicleById, updateVehicle } from "../../services/api";
import VehicleDetails from "../../components/VehicleDetails/VehicleDetails";
import "./VehiclesPage.css";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // EFECTO PRINCIPAL: Carga vehículos
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getVehicles();
        setVehicles(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error cargando vehículos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // MANEJAR EL INPUT DE BÚSQUEDA (Filtrado local por ahora, ya que getVehicles devuelve todo)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar vehículos basado en el término de búsqueda
  const filteredVehicles = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.plate?.toLowerCase().includes(term) ||
      v.brand?.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term)
    );
  });

  // MANEJAR SELECCIÓN DE VEHÍCULO
  const handleSelectVehicle = async (basicVehicle) => {
    setSelectedVehicle(basicVehicle);
    try {
      // Pedimos detalles completos
      const fullVehicleData = await getVehicleById(basicVehicle._id);
      const fullVehicle = fullVehicleData.vehicle || fullVehicleData; // Ajuste por si devuelve { vehicle: ... } o directo

      setSelectedVehicle((currentSelection) => {
        if (currentSelection?._id === basicVehicle._id) {
            // Si el backend devuelve clientId como string (no poblado) pero nosotros lo teníamos poblado, lo preservamos
            if (typeof fullVehicle.clientId === 'string' && typeof basicVehicle.clientId === 'object') {
                return { ...fullVehicle, clientId: basicVehicle.clientId };
            }
            return fullVehicle;
        }
        return currentSelection;
      });
    } catch (error) {
      console.error("Error cargando detalles del vehículo", error);
    }
  };

  // GUARDAR CAMBIOS
  const handleSaveVehicle = async (updatedVehicle) => {
    try {
      // PREPARAR PAYLOAD: El backend espera clientId como string (ID), no objeto
      const payload = { ...updatedVehicle };
      if (payload.clientId && typeof payload.clientId === 'object') {
        payload.clientId = payload.clientId._id;
      }

      const savedVehicle = await updateVehicle(payload);
      
      // RESTAURAR POBLACIÓN: Si el backend devuelve el objeto sin poblar, 
      // restauramos el cliente que teníamos para que la UI no parpadee ni pierda el nombre
      if (typeof savedVehicle.clientId === 'string' && typeof updatedVehicle.clientId === 'object') {
        savedVehicle.clientId = updatedVehicle.clientId;
      }

      // Actualizar la lista izquierda
      setVehicles((prev) =>
        prev.map((v) => (v._id === savedVehicle._id ? savedVehicle : v))
      );
      
      // Actualizar el panel derecho
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
        <h2>Vehículos</h2>
        
        {/* INPUT DE BÚSQUEDA */}
        <input
          type="text"
          placeholder="Buscar por matrícula, marca, modelo..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && filteredVehicles.length === 0 && <p>No se encontraron vehículos.</p>}
        
        {!loading && (
          <ul className="vehicles-list-items">
            {filteredVehicles.map((v) => (
              <li 
                key={v._id} 
                onClick={() => handleSelectVehicle(v)}
                className={`vehicle-item ${selectedVehicle?._id === v._id ? "active" : ""}`}
              >
                <div className="vehicle-avatar">
                  {v.brand?.charAt(0).toUpperCase()}
                </div>
                <div className="vehicle-main">
                  <span className="vehicle-plate">{v.plate}</span>
                  <span className="vehicle-model">{v.brand} {v.model}</span>
                  <span className="vehicle-client">👤 {v.clientId?.name || "Sin Dueño"}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* PANEL DERECHO (DETALLES) */}
      <div className="vehicle-details-panel">
        {selectedVehicle ? (
          <VehicleDetails
            key={selectedVehicle._id}
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            onSave={handleSaveVehicle}
          />
        ) : (
          <p>Selecciona un vehículo de la lista.</p>
        )}
      </div>
    </div>
  );
}
