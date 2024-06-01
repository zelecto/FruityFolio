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

export async function getNumeroVentaProducto(fechaInicio, fechaFin, username) {
    try {
        const params = new URLSearchParams({
            fechaInicio,
            fechaFin,
            username
        }).toString();

        const respuesta = await axios.get(`${url}/api/DetallesProductosVendidos/VentasPorProductoEnRangoFechas?${params}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error.message };
    }
}

export async function getIngresoFacturaDia(fechaInicio, fechaFin, username) {
    try {
        const params = new URLSearchParams({
            fechaInicio,
            fechaFin,
            username
        }).toString();

        const respuesta = await axios.get(`${url}/api/Facturas/IngresosPorDia?${params}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error.message };
    }
}

export async function getCantidadOrdenesMeses(fechaInicio, fechaFin, username) {
    try {
        const params = new URLSearchParams({
            fechaInicio,
            fechaFin,
            username
        }).toString();

        const respuesta = await axios.get(`${url}/api/Pedidos/CantidadPorMes?${params}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error.message };
    }
}
