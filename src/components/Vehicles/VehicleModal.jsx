import { useState, useEffect } from "react";
import { createVehicle, getClients } from "../../services/api";
import "./VehicleModal.css";

export default function VehicleModal({
  isOpen,
  onClose,
  initialClientId = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    plate: "",
    kms: "",
    client: initialClientId || "",
  });

  // ESTADOS PARA EL BUSCADOR DE CLIENTES
  const [clientSearchTerm, setClientSearchTerm] = useState(""); // Lo que escribe el usuario
  const [foundClients, setFoundClients] = useState([]); // Resultados de la API
  const [selectedClientName, setSelectedClientName] = useState(""); // Para mostrar el nombre elegido

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // EFECTO 1: Si viene un cliente inicial (desde ClientsPage), lo pre-configuramos
  useEffect(() => {
    if (initialClientId) {
      setFormData((prev) => ({ ...prev, client: initialClientId }));
      // Aquí no tenemos el nombre del cliente a mano para mostrarlo bonito,
      // pero como venimos de la página de ese cliente, se asume el contexto.
    }
  }, [initialClientId]);

  // EFECTO 2: Buscador de clientes (DEBOUNCE)
  useEffect(() => {
    // Si ya tenemos un cliente seleccionado o el input está vacío, no buscamos
    if (formData.client || clientSearchTerm.trim() === "") {
      setFoundClients([]);
      return;
    }

    // Retardo de 500ms para no saturar la API mientras escribes
    const timeoutId = setTimeout(async () => {
      try {
        // Buscamos en la API (página 1, término de búsqueda)
        const data = await getClients(1, clientSearchTerm);
        setFoundClients(data.clients || []);
      } catch (error) {
        console.error("Error buscando clientes:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [clientSearchTerm, formData.client]);

  if (!isOpen) return null;

  // Manejo de inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cuando el usuario hace clic en un cliente de la lista
  const handleSelectClientFromSearch = (clientObj) => {
    // 1. Guardamos el ID en el form (lo que se enviará al server)
    setFormData((prev) => ({ ...prev, client: clientObj._id }));
    // 2. Guardamos el nombre para mostrarlo visualmente
    setSelectedClientName(clientObj.name);
    // 3. Limpiamos la búsqueda
    setFoundClients([]);
    setClientSearchTerm("");
  };

  // Para deseleccionar y buscar otro
  const handleRemoveClient = () => {
    setFormData((prev) => ({ ...prev, client: "" }));
    setSelectedClientName("");
    setClientSearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.brand ||
      !formData.model ||
      !formData.plate ||
      !formData.kms
    ) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    // Validación Regex Matrícula
    const plateRegex =
      /^(\d{4}[B-DF-HJ-NP-TV-Z]{3}|[A-Z]{1,2}\d{4}[A-Z]{0,2})$/i;
    if (!plateRegex.test(formData.plate)) {
      setError("Matrícula inválida.");
      setLoading(false);
      return;
    }

    if (!formData.client) {
      setError("Debes asignar un cliente.");
      setLoading(false);
      return;
    }

    try {
      const vehicleToSend = {
        brand: formData.brand,
        model: formData.model,
        plate: formData.plate.toUpperCase(),
        kms: Number(formData.kms),
        client: formData.client,
      };

      await createVehicle(vehicleToSend);

      alert("Vehículo creado correctamente ✅");
      onSuccess();
      onClose();

      // Reset total
      setFormData({
        brand: "",
        model: "",
        plate: "",
        kms: "",
        client: initialClientId || "",
      });
      setSelectedClientName("");
      setClientSearchTerm("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Añadir Vehículo</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Fila 1: Matrícula y Kms */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Matrícula:</label>
              <input
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                placeholder="0000XXX"
                maxLength={10}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Kms:</label>
              <input
                type="number"
                name="kms"
                value={formData.kms}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Marca:</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ej. Toyota"
            />
          </div>

          <div className="form-group">
            <label>Modelo:</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Ej. Corolla"
            />
          </div>

          {/* SECCIÓN BUSCADOR DE CLIENTES */}
          {!initialClientId && (
            <div className="form-group" style={{ position: "relative" }}>
              <label>Asignar a Cliente:</label>

              {/* OPCIÓN A: Ya tenemos cliente seleccionado -> Mostramos nombre y botón X */}
              {formData.client ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    border: "1px solid #4caf50",
                    borderRadius: "4px",
                    backgroundColor: "#e8f5e9",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    👤 {selectedClientName}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveClient}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#d32f2f",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                /* OPCIÓN B: No hay cliente -> Input buscador */
                <>
                  <input
                    type="text"
                    placeholder="Escribe nombre, DNI o teléfono..."
                    value={clientSearchTerm}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    autoComplete="off"
                  />

                  {/* Lista de resultados flotante */}
                  {foundClients.length > 0 && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "0 0 4px 4px",
                        zIndex: 1000,
                        maxHeight: "150px",
                        overflowY: "auto",
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {foundClients.map((c) => (
                        <li
                          key={c._id}
                          onClick={() => handleSelectClientFromSearch(c)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #eee",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#f0f0f0")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "white")
                          }
                        >
                          <strong>{c.name}</strong>{" "}
                          <small>({c.telephone})</small>
                        </li>
                      ))}
                    </ul>
                  )}
                  {clientSearchTerm && foundClients.length === 0 && (
                    <small style={{ color: "#999" }}>Buscando...</small>
                  )}
                </>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Guardando..." : "Guardar Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
