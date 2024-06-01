import axios from 'axios';
const url = "https://localhost:7208";

export async function GetCuentaUsuario(username, password) {
    try {
        const params = new URLSearchParams({
            contraseña: password,
        }).toString();
        const respuesta = await axios.get(`https://localhost:7208/api/CombinedUsers/${username}?${params}`);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };

    }
}