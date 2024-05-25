import axios from 'axios';
const url = "https://localhost:7208";

export async function GetCiudades() {
    try {
        const respuesta = await axios.get('https://localhost:7208/api/Ciudad');
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };

    }
}