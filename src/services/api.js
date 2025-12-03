const API_URL = "http://localhost:8080/api/v1";

// Función Auxiliar de Headers (Debe estar aquí para ser accesible)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  // Configuración base: JSON content:
  const headers = {
    "Content-Type": "application/json",
  };
  // Si hay token, añadimos el header de autorización:
  if (token) {
    // Formato Bearer: ¡Importante el espacio después de Bearer!
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// traer y buscar clientes:
export const getClients = async (page = 1, search = "") => {
  // preparamos los parámetros de la URL:
  const params = new URLSearchParams({
    page: page,
    limit: 10, // aseguramos que coincida con el default del backend
    search: search,
  });

  // añadimos los params a la URL: /clients?page=1&search=...
  const res = await fetch(`${API_URL}/clients?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Error 401: Sesión expirada o no autorizado.");
    }
    const errorBody = await res
      .json()
      .catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
    throw new Error(
      errorBody.error || `Error obteniendo clientes. Código: ${res.status}`
    );
  }

  const data = await res.json();

  // 4. IMPORTANTE: Devolvemos 'data' completo.
  // con { clients: [...] y pagination: {...} }
  return data;
};

export const getClientById = async (id) => {
  // Validación simple por seguridad
  if (!id) throw new Error("Se necesita un ID para buscar el cliente.");

  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Error 401: Sesión expirada o no autorizado.");
    }
    if (res.status === 404) {
      throw new Error("Cliente no encontrado (404).");
    }

    const errorBody = await res
      .json()
      .catch(() => ({ error: `Error desconocido` }));
    throw new Error(
      errorBody.error || `Error obteniendo cliente. Código: ${res.status}`
    );
  }

  const data = await res.json();

  // NOTA: Tu backend 'getClientById' devuelve el objeto directo: res.json(client)
  // Así que devolvemos 'data' directamente.
  return data;
};

export const updateClient = async (client) => {
  const res = await fetch(`${API_URL}/clients/${client._id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(client),
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido al actualizar" }));
    throw new Error(errorBody.error || "Error actualizando cliente");
  }

  const data = await res.json();
  return data.client;
};

export const getVehicles = async () => {
  // 2. Realizar la petición
  const res = await fetch(`${API_URL}/vehicles`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  // 3. Manejo de errores
  if (res.status === 401) {
    throw new Error("Error 401: Sesión expirada o no autorizado.");
  }

  if (!res.ok) {
    // Manejo genérico para 403, 500, etc.
    const errorBody = await res
      .json()
      .catch(() => ({ error: `Error HTTP ${res.status}` }));
    throw new Error(
      errorBody.error || `Error obteniendo vehículos. Código: ${res.status}`
    );
  }

  // 4. Devolver datos
  const data = await res.json();
  return data.vehicles;
};

export const getMechanics = async () => {
  // 1. Obtener los headers con el token JWT
  const res = await fetch(`${API_URL}/mechanics`, {
    method: "GET",
    headers: getAuthHeaders(), // Asume que getAuthHeaders() está definida arriba
  });

  // 2. Manejo de errores
  if (!res.ok) {
    // Si el estado es 401, el token fue rechazado
    if (res.status === 401) {
      throw new Error("Error 401: Sesión expirada o no autorizado.");
    }

    // Manejo de otros errores
    const errorBody = await res
      .json()
      .catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
    throw new Error(
      errorBody.error || `Error obteniendo mecánicos. Código: ${res.status}`
    );
  }

  // 3. Devolver solo el array
  const data = await res.json();
  return data.mechanics;
};

export const getWorkorders = async (page = 1, search = "") => {
  // 1. Obtener los headers con el token JWT
  const params = new URLSearchParams({
    page: page,
    limit: 10,
    search: search,
  });

  const res = await fetch(`${API_URL}/workorders?${params.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(), // Asume que getAuthHeaders() está definida arriba
  });

  // 2. Manejo de errores
  if (!res.ok) {
    // Si el estado es 401, el token fue rechazado
    if (res.status === 401) {
      throw new Error("Error 401: Sesión expirada o no autorizado.");
    }

    // Manejo de otros errores
    const errorBody = await res
      .json()
      .catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
    throw new Error(
      errorBody.error ||
        `Error obteniendo partes de trabajo. Código: ${res.status}`
    );
  }

  // 3. Devolver solo el array
  const data = await res.json();
  return data; // Devolvemos todo el objeto (workorders + pagination)
};

export const getWorkorderById = async (id) => {
  if (!id) throw new Error("Se necesita un ID para buscar la orden.");

  const res = await fetch(`${API_URL}/workorders/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Error 401: Sesión expirada.");
    if (res.status === 404) throw new Error("Orden no encontrada (404).");
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido" }));
    throw new Error(
      errorBody.error || `Error obteniendo orden. Código: ${res.status}`
    );
  }

  const data = await res.json();
  return data; // Asumimos que devuelve el objeto directo o { workorder: ... }
};

export const updateWorkorder = async (workorder) => {
  // 1. Usamos el ID de la workorder para la ruta PUT
  const res = await fetch(`${API_URL}/workorders/${workorder._id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    // Enviamos el objeto completo de la orden de trabajo en el cuerpo
    body: JSON.stringify(workorder),
  });

  // 2. Manejo de errores HTTP
  if (!res.ok) {
    // Intentamos leer el cuerpo del error si está disponible (ej. 400, 409, 500)
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido al actualizar" }));

    throw new Error(
      errorBody.error || "Error actualizando la orden de trabajo"
    );
  }

  // 3. Devolver los datos actualizados
  const data = await res.json();

  // Asumimos que tu backend devuelve la orden actualizada en la propiedad 'workorder'
  return data.workorder;
};

export const createWorkorder = async (workorder) => {
  const res = await fetch(`${API_URL}/workorders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(workorder),
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido al crear" }));
    throw new Error(errorBody.error || "Error creando la orden de trabajo");
  }

  const data = await res.json();
  return data.workorder;
};

export const createVehicle = async (vehicle) => {
  const res = await fetch(`${API_URL}/vehicles`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(vehicle),
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido al crear vehículo" }));
    throw new Error(errorBody.error || "Error creando vehículo");
  }

  const data = await res.json();
  return data.vehicle;
};

export const getVehicleById = async (id) => {
  if (!id) throw new Error("Se necesita un ID para buscar el vehículo.");

  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Error 401: Sesión expirada.");
    if (res.status === 404) throw new Error("Vehículo no encontrado (404).");
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido" }));
    throw new Error(
      errorBody.error || `Error obteniendo vehículo. Código: ${res.status}`
    );
  }

  const data = await res.json();
  return data; // Asumimos que devuelve el objeto directo o { vehicle: ... }
};

export const updateVehicle = async (vehicle) => {
  const res = await fetch(`${API_URL}/vehicles/${vehicle._id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(vehicle),
  });

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ error: "Error desconocido al actualizar vehículo" }));
    throw new Error(errorBody.error || "Error actualizando vehículo");
  }

  const data = await res.json();
  return data.vehicle;
};
