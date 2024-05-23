import React, { useState } from 'react';
const ciudadesColombia = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    // Añadir más ciudades relevantes de Colombia aquí...
];

const TiendaFormulario = ({  handelshowReguistrarTienda }) => {
    const [nombre, setNombre] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [direccion, setDireccion] = useState('');
    const [errores, setErrores] = useState({});

    const onGuardarTienda=()=>{
        console.log("Guardar")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            onGuardarTienda({ nombre, ciudad, direccion });
            handelshowReguistrarTienda(false);
            window.location.reload()
        }
    };

    const validarFormulario = () => {
        const errores = {};
        if (!nombre.trim()) {
            errores.nombre = 'El nombre de la tienda es requerido';
        }
        if (!ciudad) {
            errores.ciudad = 'Por favor selecciona una ciudad';
        }
        if (!direccion.trim()) {
            errores.direccion = 'La dirección es requerida';
        }
        setErrores(errores);
        return Object.keys(errores).length === 0;
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
            <div className="bg-white p-8 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4">Completa la información de tu tienda</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block font-semibold mb-1">Nombre de la tienda</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border-gray-300 border rounded-md px-3 py-2"
                        />
                        {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="ciudad" className="block font-semibold mb-1">Ciudad</label>
                        <select
                            id="ciudad"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            className="w-full border-gray-300 border rounded-md px-3 py-2"
                        >
                            <option value="">Selecciona una ciudad</option>
                            {ciudadesColombia.map((ciudad) => (
                                <option key={ciudad} value={ciudad}>{ciudad}</option>
                            ))}
                        </select>
                        {errores.ciudad && <p className="text-red-500 text-sm mt-1">{errores.ciudad}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="direccion" className="block font-semibold mb-1">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full border-gray-300 border rounded-md px-3 py-2"
                        />
                        {errores.direccion && <p className="text-red-500 text-sm mt-1">{errores.direccion}</p>}
                    </div>
                    <div className='flex justify-between'>
                        <button type="submit" className="bg-green-400 hover:bg-green-600 font-bold text-white py-2 px-4 rounded-md">
                            Crear Tienda
                        </button>
                        <button className="bg-red-400 hover:bg-red-600 font-bold text-white py-2 px-4 rounded-md"
                            onClick={(e)=> handelshowReguistrarTienda(false)}
                        >
                            Crear Tienda
                        </button>
                    </div>

                    
                </form>
            </div>
        </div>
    );
};

export default TiendaFormulario;
