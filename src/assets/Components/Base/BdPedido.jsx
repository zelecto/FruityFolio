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

export const getPedidos = async (tiendaId, estado = null) => {
    try {
        const requestUrl = estado ? `${url}/api/Pedidos/FullDetails/tienda/${tiendaId}?estado=${estado}` : `${url}/api/Pedidos/FullDetails/tienda/${tiendaId}`;
        const response = await axios.get(requestUrl);
        return response;
    } catch (error) {
        return null;
    }
};

export async function postPedido(pedido) {
    try {
        const respuesta = await axios.post(`${url}/api/Pedidos`, pedido);
        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

export async function ActualizarEstadoYPrecioEnvio(pedidoId, estado, precioEnvio) {
    try {
        const respuesta = await axios.patch(`${url}/api/pedidos/${pedidoId}/ActualizarEstadoYPrecioEnvio`, {
            estado: estado,
            precioEnvio: precioEnvio
        });
        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

export async function EliminarPedido(pedidoId) {
    try {
        const respuesta = await axios.delete(`${url}/api/Pedidos/${pedidoId}`);
        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

export const getPedidosClient = async (usernameClient, estado = null) => {
    try {
        const requestUrl = estado ? `${url}/api/Pedidos/cliente/${usernameClient}?estado=${estado}` : `${url}/api/Pedidos/cliente/${usernameClient}`;
        const response = await axios.get(requestUrl);
        return response;
    } catch (error) {
        return null;
    }
};
