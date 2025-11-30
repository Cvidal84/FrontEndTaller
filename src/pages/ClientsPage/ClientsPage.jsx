
import { useEffect, useState } from "react";
// 1. IMPORTANTE: Importamos getClientById
import { getClients, updateClient, getClientById } from "../../services/api";
import ClientDetails from "../../components/ClientCard/ClientDetails";
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
    // PASO A: UI Optimista.
    // Mostramos inmediatamente los datos básicos que ya tenemos en la lista (Nombre, Tlf...)
    // Así el usuario siente que la app es instantánea.
    setSelectedClient(basicClient);

    try {
      // PASO B: Pedimos los detalles COMPLETOS al servidor (Aquí vienen los vehículos)
      // Asegúrate de que tu backend getClientById tenga el .populate('vehicles')
      const fullClientData = await getClientById(basicClient._id);

      // PASO C: Actualizamos el estado con los datos completos
      // React volverá a renderizar ClientCard, ahora con la lista de coches
      setSelectedClient(fullClientData);
    } catch (err) {
      console.error("Error cargando detalles profundos del cliente", err);
      // Opcional: Podrías mostrar una alerta si falla la carga de detalles
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
              className="client-item"
              // 3. CAMBIO AQUÍ: Usamos la nueva función en vez del setter directo
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

          <ClientDetails // ✅ CORREGIDO: Usar el nombre ClientDetails

            // La key fuerza a que se reinicie el componente si cambiamos de ID

            key={selectedClient._id}

            client={selectedClient}

            onClose={() => setSelectedClient(null)}

            onSave={handleSaveClient}

            // Aquí iría tu onAddVehicle cuando lo implementes

          />

        ) : (

          <p>Selecciona un cliente de la lista</p>

        )}

      </div>

    </div>

  );
}
