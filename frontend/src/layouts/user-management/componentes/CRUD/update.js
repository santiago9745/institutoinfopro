export const updateResource = async (url, data, action) => {
  try {
    const res = await fetch(url, {
      method: action === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json',
                  'Accept': 'application/json',
       },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error en updateResource:", err);
    throw err;
  }
};