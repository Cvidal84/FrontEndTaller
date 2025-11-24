const API_URL = "http://localhost:8080/api/v1";

export const getClients = async () => {
  const res = await fetch(`${API_URL}/clients`);
  if (!res.ok) throw new Error("Error obteniendo clientes");
  return res.json();
};


export const updateClient = async (client) => {
  const res = await fetch(`${API_URL}/clients/${client._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });

  if (!res.ok) throw new Error("Error actualizando cliente");

  const data = await res.json();
  return data.client;
};

export const getVehicles = async () => {
  const res = await fetch(`${API_URL}/vehicles`);
  if (!res.ok) throw new Error("Error obteniendo vehículos");
  return res.json();
};

export const getMechanics = async () => {
  const res = await fetch(`${API_URL}/mechanics`);
  if (!res.ok) throw new Error("Error obteniendo mecánicos");
  return res.json();
};

export const getWorkorders = async () => {
  const res = await fetch(`${API_URL}/workorders`);
  if (!res.ok) throw new Error("Error obteniendo órdenes de trabajo");
  return res.json();
};
