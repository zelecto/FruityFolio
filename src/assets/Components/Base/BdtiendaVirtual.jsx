import axios from 'axios';
const url = "https://localhost:7208";

// Función para obtener el token almacenado
function getToken() {
    return localStorage.getItem('token'); // Asegúrate de almacenar el token en el localStorage cuando inicias sesión
}

// Configurar el interceptor para incluir el token en cada solicitud
axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export async function GetTiendaVirtualUsernameDetail(username, fecha, estado) {
    try {
        const respuesta = await axios.get(`${url}/api/TiendaVirtuals/by-username/${username}/pedidos?fecha=${fecha}&estado=${estado}`);

        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function GuardarTienda(tienda) {
    try {
        const respuesta = await axios.post(`${url}/api/TiendaVirtuals`, tienda);

        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function GetTiendasCiudad(ciudad) {
    try {
        const respuesta = await axios.get(`${url}/api/TiendaVirtuals/TopFrutasDisponiblesByCity/${ciudad}`);

        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}
