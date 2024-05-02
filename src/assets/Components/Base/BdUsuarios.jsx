import React from 'react';
import axios from 'axios';
const url = "https://localhost:7208";

export async function GuardarUsuario(nuevoUsuario) {
    try {
        const respuesta = await axios.post('https://localhost:7208/api/Usuarios', nuevoUsuario);
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

