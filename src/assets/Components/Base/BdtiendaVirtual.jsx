import axios from 'axios';

export async function GetTiendaVirtualUsernameDetail(username,fecha,estado) {
    try {
        const respuesta = await axios.get(`https://localhost:7208/api/TiendaVirtuals/by-username/${username}/pedidos?fecha=${fecha}&estado=${estado}`);

        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };

    }
}

export async function GuardarTienda(tienda) {

    try {
        const respuesta = await axios.post(`https://localhost:7208/api/TiendaVirtuals`,tienda);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}


export async function GetTiendasCiudad(ciudad) {

    try {
        const respuesta = await axios.get(`https://localhost:7208/api/TiendaVirtuals/TopFrutasDisponiblesByCity/${ciudad}`);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}
