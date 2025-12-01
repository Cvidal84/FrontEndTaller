import { useEffect, useState } from "react";
import { getClients, updateClient, getClientById } from "../../services/api";
import ClientDetails from "../../components/ClientDetails/ClientDetails";
import "./ClientsPage.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Cargar lista de clientes (ligera) al inicio
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando clientes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 2. NUEVA FUNCIÓN: Manejar la selección del cliente
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
    } catch (err) {
      console.error("Error cargando detalles profundos del cliente", err);
    }
  };

  // Guardar cambios de cliente
  const handleSaveClient = async (updatedClient) => {
    try {
      const clientFromApi = await updateClient(updatedClient);

      // actualizar lista izquierda
      setClients((prev) =>
        prev.map((c) => (c._id === clientFromApi._id ? clientFromApi : c))
      );

      // actualizar panel derecho
      setSelectedClient(clientFromApi);

      alert("Cliente actualizado correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("Hubo un error al actualizar el cliente ❌");
    }
  };

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="clients-layout">
      {/*LISTA IZQUIERDA*/}
      <div className="clients-list">
        <h2>Clientes</h2>

        {clients.length === 0 && <p>No hay clientes.</p>}

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
      </div>

      {/* PANEL DERECHO */}
      <div className="client-details">
        {selectedClient ? (
          <ClientDetails
            // La key fuerza a que se reinicie el componente si cambiamos de ID
            key={selectedClient._id}
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onSave={handleSaveClient}

            // Aquí iría onAddVehicle cuando se implementes
          />
        ) : (
          <p>Selecciona un cliente de la lista</p>
        )}
      </div>
    </div>
  );
}
