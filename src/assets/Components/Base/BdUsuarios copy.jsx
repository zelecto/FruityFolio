
import axios from 'axios';
const url = "https://localhost:7208";

export async function GuardarCliente(nuevocliente) {
    try {
        const respuesta = await axios.post('https://localhost:7208/api/ClienteUsuarios', nuevocliente);
        return { datos: respuesta.data, error: null };
    } catch (error) {
        return { datos: null, error: error };
        
    }
}

export async function ConsultarCliente(username) {
    
    try {
        const respuesta = await axios.get(`https://localhost:7208/api/Usuarios/${username}`);
        
        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

