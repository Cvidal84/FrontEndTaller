import { useEffect, useState } from "react";
import { getClients, updateClient, getClientById } from "../../services/api";
import ClientDetails from "../../components/ClientDetails/ClientDetails";
import "./ClientsPage.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // EFECTO PRINCIPAL: Carga clientes cuando cambia la página o la búsqueda
  useEffect(() => {
    // Usamos setTimeout para el DEBOUNCE (evitar muchas llamadas seguidas al escribir)
    const timeOutId = setTimeout(async () => {
      setLoading(true);
      setError(""); // Limpiamos errores previos

      try {
        // Llamamos a la API pasando la página y el término de búsqueda
        const data = await getClients(page, searchTerm);
        // La API ahora devuelve { clients: [], pagination: {} }
        setClients(data.clients);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error(error);
        setError("Error cargando clientes");
      } finally {
        setLoading(false);
      }
    }, 500); // Retardo de 500ms

    // Función de limpieza: cancela el timeout anterior si el usuario sigue escribiendo
    return () => clearTimeout(timeOutId);
  }, [page, searchTerm]); // ✅ Se ejecuta cada vez que cambia 'page' o 'searchTerm'

  // MANEJAR EL INPUT DE BÚSQUEDA
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // IMPORTANTE: Al buscar algo nuevo, reseteamos a la página 1
  };

  // NUEVA FUNCIÓN: Manejar la selección del cliente
  const handleSelectClient = async (basicClient) => {
    // Mostramos inmediatamente los datos básicos que ya tenemos en la lista (Nombre, Tlf...)
    setSelectedClient(basicClient);
    try {
      // Pedimos los detalles COMPLETOS al servidor (Aquí vienen los vehículos)
      const fullClientData = await getClientById(basicClient._id);
      // Actualizamos el estado con los datos completos
      // React volverá a renderizar ClientCard, ahora con la lista de coches
      // Comprobamos si el usuario NO ha cambiado de selección mientras cargaba
      setSelectedClient((currentSelection) => {
        if (currentSelection?._id === basicClient._id) {
          return fullClientData;
        }
        return currentSelection; // Si ya cambió a otro, no sobrescribimos
      });
    } catch (error) {
      console.error("Error cargando detalles del cliente", error);
    }
  };
  // Guardar cambios de cliente
  const handleSaveClient = async (updatedClient) => {
    try {
      const clientFromApi = await updateClient(updatedClient);
      // actualizar lista izquierda:
      setClients((prev) =>
        prev.map((c) => (c._id === clientFromApi._id ? clientFromApi : c))
      );
      // actualizar panel derecho:
      setSelectedClient(clientFromApi);
      alert("Cliente actualizado correctamente ✅");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el cliente ❌");
    }
  };

  return (
    <div className="clients-layout">
      {/* LISTA IZQUIERDA */}
      <div className="clients-list">
        <h2>Clientes</h2>

        {/* 1. INPUT DE BÚSQUEDA */}
        <input
          type="text"
          placeholder="Buscar por nombre, tlf, email, DNI..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* FEEDBACK DE CARGA O ERROR */}
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && clients.length === 0 && <p>No se encontraron clientes.</p>}

        {/* LISTA */}
        {!loading && (
          <ul className="clients-list-items">
            {clients.map((c) => (
              <li
                key={c._id}
                className={`client-item ${
                  selectedClient?._id === c._id ? "active" : ""
                }`}
                onClick={() => handleSelectClient(c)}
              >
                <div className="client-avatar">
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <div className="client-main">
                  <span className="client-name">{c.name}</span>
                  <span className="client-phone">{c.telephone}</span>
                  {c.email && <span className="client-email">{c.email}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 2. CONTROLES DE PAGINACIÓN */}
        {/* ✅ CAMBIO: Solo se renderiza este bloque si hay clientes (> 0) */}
        {clients.length > 0 && (
          <div
            className="pagination-controls"
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ◀︎
            </button>

            <span style={{ alignSelf: "center" }}>
              {page}/{totalPages || 1}
            </span>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              ▶︎
            </button>
          </div>
        )}
      </div>

      {/* PANEL DERECHO */}
      <div className="client-details">
        {selectedClient ? (
          <ClientDetails
            key={selectedClient._id}
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onSave={handleSaveClient}
          />
        ) : (
          <p>Selecciona un cliente de la lista</p>
        )}
      </div>
    </div>
  );
}
