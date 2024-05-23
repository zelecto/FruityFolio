import axios from 'axios';
const url = "https://localhost:7208";

export const getPedidos = async (tiendaId, estado = null) => {
    const url = estado ? `https://localhost:7208/api/Pedidos/FullDetails/tienda/${tiendaId}?estado=${estado}` : `https://localhost:7208/api/Pedidos/FullDetails/tienda/${tiendaId}`;
    const response = await axios.get(url);
    return response;
};

export async function ConsultarUsuario(username) {

    try {
        const respuesta = await axios.get(`${url}/api/Usuarios/${username}`);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}
