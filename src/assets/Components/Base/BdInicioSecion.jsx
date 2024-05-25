import axios from 'axios';
const url = "https://localhost:7208";

export async function GetCuentaUsuario(username) {
    try {
        const respuesta = await axios.get(`https://localhost:7208/api/CombinedUsers/${username}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };

    }
}