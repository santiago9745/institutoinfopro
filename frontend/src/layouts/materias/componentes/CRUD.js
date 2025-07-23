export const updateResource = async (url, data, action) => {
  try {
    const token = sessionStorage.getItem("access_token"); // Obtiene el token de sesión

    if (!token) {
      // Lanza un error si no hay token, evitando peticiones no autorizadas
      throw new Error("❌ No se encontró el token de autenticación. Por favor, inicia sesión.");
    }

    const res = await fetch(url, {
      method: action === 'create' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`, // ¡Añade el token aquí!
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // Intenta parsear la respuesta de error si es JSON, si no, usa el texto crudo
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      const errorMessage = errorData.message || `Error desconocido con estado ${res.status}`;
      throw new Error(`❌ Fallo en la operación ${action}: ${errorMessage}`);
    }

    // Si la respuesta no tiene contenido (por ejemplo, 204 No Content), no intentes parsear JSON
    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return {}; // Retorna un objeto vacío
    }

    return await res.json(); // Devuelve la respuesta del servidor en formato JSON
  } catch (err) {
    console.error("Error en updateResource:", err);
    throw err; // Propaga el error para que el componente pueda manejarlo
  }
};