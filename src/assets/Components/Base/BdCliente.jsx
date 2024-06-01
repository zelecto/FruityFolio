import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = "https://localhost:7208";

// Función para obtener el token almacenado
function getToken() {
    return localStorage.getItem('token'); // Asegúrate de almacenar el token en el localStorage cuando inicias sesión
}

// Configurar el interceptor para incluir el token en cada solicitud
axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

const Clientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get(`${url}/api/Clientes`);
                setClientes(response.data);
            } catch (error) {
                console.error('Error fetching clientes:', error);
            }
        };

        fetchClientes();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
            <ul>
                {clientes.map(cliente => (
                    <li key={cliente.cedula} className="mb-2">
                        <span className="font-bold">{cliente.nombre}</span> - {cliente.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Clientes;
