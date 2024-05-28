import axios from 'axios';
const url = "https://localhost:7208";


export async function getNumeroVentaProducto(fechaInicio, fechaFin, username) {
    try {
        const params = new URLSearchParams({
            fechaInicio,
            fechaFin,
            username
        }).toString();

        const respuesta = await axios.get(`https://localhost:7208/api/DetallesProductosVendidos/VentasPorProductoEnRangoFechas?${params}`);
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

        const respuesta = await axios.get(`https://localhost:7208/api/Facturas/IngresosPorDia?${params}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error.message };
    }
}
