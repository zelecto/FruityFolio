import React from 'react';
import axios from 'axios';
const url = "https://localhost:7208";

export async function GuardarProducto(nuevoProducto) {
    var respuesta;
    
    try {
        respuesta = await axios.post('https://localhost:7208/api/Productos', nuevoProducto);

    } catch (error) {
        return error;
    }
    
}

export async function ConsultarProductos(username) {

    try {
        const respuesta = await axios.get(`https://localhost:7208/api/Productos/usuarios/${username}`);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}
export async function ConsultarProductosPorStock(username, stockMayorAZero) {
    try {
        const respuesta = await axios.get(`https://localhost:7208/api/productos/Usuarios/${username}/FiltrarPorStock`, {
            params: {
                stockMayorAZero: stockMayorAZero
            }
        });

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

export async function ActualizarProductos(producto) {

    try {
        const respuesta = await axios.put(`https://localhost:7208/api/Productos/${producto.id}`,producto);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}

export async function BorrarProducto(producto) {
    try {
        producto.activo =false;
        const respuesta = await axios.put(`https://localhost:7208/api/Productos/${producto.id}`, producto);

        return { datos: respuesta.data, error: null }; // Retornar un objeto con las variables
    } catch (error) {
        return { datos: null, error: error }; // Retornar un objeto con las variables
    }
}
