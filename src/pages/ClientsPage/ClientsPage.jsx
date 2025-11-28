import { useEffect, useState } from "react";
import { getClients, updateClient } from "../../services/api";
import ClientCard from "../../components/ClientCard/ClientCard";
import "./ClientsPage.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Cargar clientes al inicio
  useEffect(() => {
    const load = async () => {
      try {
        const clients = await getClients();
        setClients(clients);
      } catch (err) {
        console.error(err);
        setError("Error cargando clientes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Guardar cambios de cliente
  const handleSaveClient = async (updatedClient) => {
    try {
      const clientFromApi = await updateClient(updatedClient);

      // actualizar lista
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
              className="client-item"
              onClick={() => setSelectedClient(c)}
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
          <ClientCard
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
