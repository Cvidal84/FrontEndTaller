const API_URL = "http://localhost:8080/api/v1";

// 1. Función Auxiliar de Headers (Debe estar aquí para ser accesible)
// --------------------------------------------------------------------
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    
    // Configuración base: JSON content
    const headers = { 
        "Content-Type": "application/json" 
    };

    // Si hay token, añadimos el header de autorización
    if (token) {
        // Formato Bearer: ¡Importante el espacio después de Bearer!
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};


// 2. Funciones de Petición con Autenticación
// --------------------------------------------------------------------

/**
 * Obtiene la lista de clientes. Ahora enviará el token.
 */
export const getClients = async () => {
    const res = await fetch(`${API_URL}/clients`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        // Si el estado es 401, sabemos que es un problema de autenticación/token
        if (res.status === 401) {
            throw new Error("Error 401: Sesión expirada o no autorizado.");
        }
        
        // Intentamos obtener un mensaje de error del cuerpo de la respuesta del backend
        const errorBody = await res.json().catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
        throw new Error(errorBody.error || `Error obteniendo clientes. Código: ${res.status}`);
    }
    
    // Devolvemos la lista de clientes (asumiendo que viene en la propiedad 'clients')
    const data = await res.json();
    return data.clients; 
};


/**
 * Actualiza un cliente. Ahora enviará el token.
 */
export const updateClient = async (client) => {
    const res = await fetch(`${API_URL}/clients/${client._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(client),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: "Error desconocido al actualizar" }));
        throw new Error(errorBody.error || "Error actualizando cliente");
    }

    const data = await res.json();
    return data.client;
};


// 3. Resto de funciones (Aplicamos la misma corrección de headers)
// --------------------------------------------------------------------

export const getVehicles = async () => {
    const res = await fetch(`${API_URL}/vehicles`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error obteniendo vehículos");
    return res.json();
};

export const getMechanics = async () => {
    const res = await fetch(`${API_URL}/mechanics`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error obteniendo mecánicos");
    return res.json();
};

export const getWorkorders = async () => {
    const res = await fetch(`${API_URL}/workorders`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Error obteniendo órdenes de trabajo");
    return res.json();
};