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


export const getClients = async () => {
    const res = await fetch(`${API_URL}/clients`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("Error 401: Sesión expirada o no autorizado.");
        }
        
        const errorBody = await res.json().catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
        throw new Error(errorBody.error || `Error obteniendo clientes. Código: ${res.status}`);
    }
    
    const data = await res.json();
    return data.clients; 
};



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



export const getVehicles = async () => {
    // 1. Obtener headers con autenticación (asumimos que getAuthHeaders() está definido arriba)
    const headers = getAuthHeaders();
    
    // 2. Realizar la petición
    const res = await fetch(`${API_URL}/vehicles`, {
        method: "GET",
        headers: headers, 
    });

    // 3. Manejo de errores
    if (res.status === 401) {
        throw new Error("Error 401: Sesión expirada o no autorizado.");
    }
    
    if (!res.ok) {
        // Manejo genérico para 403, 500, etc.
        const errorBody = await res.json().catch(() => ({ error: `Error HTTP ${res.status}` }));
        throw new Error(errorBody.error || `Error obteniendo vehículos. Código: ${res.status}`);
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
        const errorBody = await res.json().catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
        throw new Error(errorBody.error || `Error obteniendo mecánicos. Código: ${res.status}`);
    }
    
    // 3. Devolver solo el array
    const data = await res.json();
    return data.mechanics; 
};



export const getWorkorders = async () => {
    // 1. Obtener los headers con el token JWT
    const res = await fetch(`${API_URL}/workorders`, { 
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
        const errorBody = await res.json().catch(() => ({ error: `Error desconocido (Código ${res.status})` }));
        throw new Error(errorBody.error || `Error obteniendo partes de trabajo. Código: ${res.status}`);
    }
    
    // 3. Devolver solo el array
    const data = await res.json();
    return data.workorders; 
};