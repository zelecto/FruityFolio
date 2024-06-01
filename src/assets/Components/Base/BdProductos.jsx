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

export async function GuardarProducto(nuevoProducto) {
    try {
        const respuesta = await axios.post(`${url}/api/Productos`, nuevoProducto);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function ConsultarProductos(username) {
    try {
        const respuesta = await axios.get(`${url}/api/Productos/usuarios/${username}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function ConsultarProductosPorStock(username, stockMayorAZero) {
    try {
        const respuesta = await axios.get(`${url}/api/productos/Usuarios/${username}/FiltrarPorStock`, {
            params: {
                stockMayorAZero: stockMayorAZero
            }
        });
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function ActualizarProductos(producto) {
    try {
        const respuesta = await axios.put(`${url}/api/Productos/${producto.id}`, producto);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}

export async function BorrarProducto(producto) {
    try {
        producto.activo = false;
        const respuesta = await axios.put(`${url}/api/Productos/${producto.id}`, producto);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
    }
}
