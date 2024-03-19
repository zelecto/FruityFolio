import React, { useState, useEffect } from 'react';
import axios from 'axios';
const url = "https://localhost:7208";
const Clientes = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                
                const response = await axios.get(`${url}+/api/Clientes`);
                setClientes(response.data);
            } catch (error) {
                console.error('Error fetching clientes:', error);
            }
            
        };
        console.log(clientes);
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
