import axios from 'axios';
const url = "https://localhost:7208";

export const getPedidos = async (tiendaId, estado = null) => {
    try {
        const url = estado ? `https://localhost:7208/api/Pedidos/FullDetails/tienda/${tiendaId}?estado=${estado}` : `https://localhost:7208/api/Pedidos/FullDetails/tienda/${tiendaId}`;
        const response = await axios.get(url);
        return response;    
    } catch (error) {
        return null;
    }
    
};

export async function postPedido(pedido) {

    try {
        const respuesta = await axios.post(`https://localhost:7208/api/Pedidos`,pedido);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}


export async function ActualizarEstadoYPrecioEnvio(pedidoId, estado, precioEnvio) {
    try {
        const respuesta = await axios.patch(`https://localhost:7208/api/pedidos/${pedidoId}/ActualizarEstadoYPrecioEnvio`, {
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
        const respuesta = await axios.delete(`https://localhost:7208/api/Pedidos/${pedidoId}`);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}


export const getPedidosClient = async (usernameClient, estado = null) => {
    try {
        const url = estado ? `https://localhost:7208/api/Pedidos/cliente/${usernameClient}?estado=${estado}` : 
        `https://localhost:7208/api/Pedidos/cliente/${usernameClient}`;
        const response = await axios.get(url);
        return response;
    } catch (error) {
        return null;
    }

};