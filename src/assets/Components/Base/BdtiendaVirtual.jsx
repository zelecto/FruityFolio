import axios from 'axios';

export async function GetTiendaVirtualUsernameDetail(username,fecha,estado) {
    try {
        const respuesta = await axios.get(`https://localhost:7208/api/TiendaVirtuals/by-username/${username}/pedidos?fecha=${fecha}&estado=${estado}`);
        //GET: https://tusitio.com/api/TiendaVirtuals/by-username/{nombreUsuario}/pedidos?fecha={fecha}&estado={estado}

        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };

    }
}

export async function ConsultarUsuario(username) {

    try {
        const respuesta = await axios.get(`https://localhost:7208/api/Usuarios/${username}`);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}
