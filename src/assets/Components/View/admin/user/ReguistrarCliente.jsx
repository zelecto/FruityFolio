import React, { useEffect, useState } from 'react';
import { InputField } from '../factura/Facturadora.jsx';
import validarNombre, { MensajeAlert } from '../../../Tools/Validadores.jsx';
import { GuardarUsuario } from '../../../Base/BdUsuarios.jsx';
import { GetCiudades } from '../../../Base/bdCiudades.jsx';
import { GuardarCliente } from '../../../Base/BdUsuarios copy.jsx';

const RegistroClienteForm = ({ cerrar }) => {

    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [direccionResidencia, setDireccionResidencia] = useState("");
    const [ciudades, setCiudades] = useState([]);
    //Cedula
    const [mensajeErroCedula, setMensajeErroCedula] = useState("");

    const handleCedula = (newValue) => {
        if (newValue >= 0 && newValue <= 9999999999) {
            setCedula(newValue);
            setMensajeErroCedula(null);
        } else if (newValue >= 9999999999) {
            setMensajeErroCedula("No se admiten mas de 10 nuemros");
        } else if (/^[a-zA-Z]+$/.test(newValue)) {
            setCedula("");
            setMensajeErroCedula("No se admiten letras");
        }
    };
    //Nombre
    const [mensajeErroNombre, setMensajeErroNombre] = useState("");

    const handleNombre = (newValue) => {
        if (validarNombre(newValue) || newValue === "") {
            setNombre(newValue);
            setMensajeErroNombre(null);
        } else {
            setNombre("");
            setMensajeErroNombre("No se admite numeros");
        }
    };

    //Correo
    const [mensajeErroCorreo, setMensajeErroCorreo] = useState("");

    const handleCorreo = (newValue) => {
        setCorreo(newValue);
        setMensajeErroCorreo("");
    };
    const handleOnBulrCorreo = (newValue) => {
        // Expresión regular para validar un correo electrónico
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Verificar si el valor ingresado coincide con el patrón de correo electrónico
        if (!newValue.match(emailPattern) && newValue != "") {
            // Si el correo electrónico no es válido, podrías mostrar un mensaje de error o ejecutar alguna lógica adicional
            setMensajeErroCorreo("Correo electrónico no válido");
        } else {
            // Si el correo electrónico es válido, actualiza el estado con el nuevo valor
            setCorreo(newValue);
            setMensajeErroCorreo("");
        }
    };

    //UserName
    const [mensajeErroUsername, setMensajeErroUsername] = useState("");

    const handelUserName = (newValue) => {
        if (newValue.length <= 50 || newValue === "") {
            setUsername(newValue);
            setMensajeErroUsername("");
        } else {
            setMensajeErroUsername("No puede tener mas de 50 caracteres");
        }
    }

    //Password
    const [mensajeErroPasword, setMensajeErroPasword] = useState("");
    const handelPasword = (newValue) => {
        if ((newValue.length <= 20) || newValue === "") {
            setPassword(newValue);
            setMensajeErroPasword("");
        } else {
            setMensajeErroPasword("no se admite mas de 20 carecteres");
        }
    }

    const handleOnBulrPasword = () => {
        if (password.length <= 8) {
            setMensajeErroPasword("no se admite menos de 8 carecteres");
        } else {
            setMensajeErroPasword("");
        }

    }

    // Ciudad
    const [mensajeErrorCiudad, setMensajeErrorCiudad] = useState("");


    // Direccion de Residencia
    const [mensajeErrorDireccion, setMensajeErrorDireccion] = useState("");

    const handleDireccionResidencia = (newValue) => {
        if (newValue.length <= 100 || newValue === "") {
            setDireccionResidencia(newValue);
            setMensajeErrorDireccion("");
        } else {
            setMensajeErrorDireccion("No puede tener más de 100 caracteres");
        }
    };

    useEffect(() => {
        async function fetchCiudades() {
            try {
                const ciudadesFromDB = await GetCiudades(); // función que obtiene las ciudades desde la base de datos
                setCiudades(ciudadesFromDB.datos);
            } catch (error) {
                console.error("Error al obtener ciudades:", error);
            }
        }
        fetchCiudades();
    }, []);

    const handleCiudadChange = (newValue) => {
        setCiudad(newValue);
        setMensajeErrorCiudad("");
    };


    //Mensaje emergente
    const [mensaje, setMensaje] = useState({
        Mensaje: "",
        colorBoton: "",
        colorText: "",
        isError: false,
        textBoton: "",
    });

    const [showMensaje, setShowMensaje] = useState(false);

    const handleShowMensaje = (value) => {
        setShowMensaje(value);
    }
    const handleCloseShowMensaje = () => {
        setShowMensaje(false);
        cerrar();
    }

    //Reguistrar Usuario
    const handleSubmit = (e) => {
        e.preventDefault();
        const cliente = {
            username: username,
            nombre: nombre,
            cedula: cedula,
            correo: correo,
            password: password,
            ciudad: ciudad,
            direccionResidencia: direccionResidencia
        };

        if (!nombre || !cedula || !correo || !username || !password || !ciudad || !direccionResidencia) {
            const mensajeError = {
                Mensaje: "¡Error al guardar datos! Revise los campos ingresados. Es posible que haya dejado alguno vacío o haya ingresado información incorrecta.",
                colorBoton: "red",
                colorText: "text-black-700",
                isError: true,
                textBoton: "Cerrar",
            };
            handleShowMensaje(true);
            setMensaje(mensajeError);
        } else {
            
            GuardarClienteNuevo(cliente);
        }
    };


    const GuardarClienteNuevo = async (cliente) => {

        const respuesta = await GuardarCliente(cliente);
        if (!respuesta.error) {
            const mensajeGuardado = {
                Mensaje: "Datos guardados correctamente",
                colorBoton: "green",
                colorText: "text-black-700",
                
                textBoton: "Aceptar",
            };

            setMensaje(mensajeGuardado);

        } else {
            const mensajeError = {
                Mensaje: "¡Error al guardar datos!. No se puede reguistrar con el mismo nombre de usuario, cedula o correo",
                colorBoton: "red",
                colorText: "text-black-700",
                
                textBoton: "Cerrar",
            };
            setMensaje(mensajeError);
        }

        handleShowMensaje(true);
    }

    return (
        <div className=" w-1/2 p-6 bg-white shadow-md rounded-md">
            {showMensaje && (
                <div className="">

                    <MensajeAlert
                        message={mensaje.Mensaje}
                        onClose={handleCloseShowMensaje}
                        isError={mensaje.isError}
                        buttonColor={mensaje.colorBoton}
                        textColor={mensaje.colorText}
                        buttonText={mensaje.textBoton}
                    />
                </div>
            )}
            <h2 className="text-2xl font-semibold mb-4 text-center">Registrar</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">

                    <InputField
                        label="Cedula"
                        id="cedula"
                        type="text"
                        placeholder="cedula"
                        value={cedula}
                        onChange={(e) => handleCedula(e.target.value)}
                        errorMessage={mensajeErroCedula}
                    />


                </div>
                <div className="mb-4">
                    <InputField
                        label="Nombre"
                        id="Nombre"
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => handleNombre(e.target.value)}
                        errorMessage={mensajeErroNombre}
                    />

                </div>
                <div className="mb-4">
                    <InputField
                        label="Correo"
                        id="Correo"
                        type="text"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => handleCorreo(e.target.value)}
                        onBlur={(e) => handleOnBulrCorreo(e.target.value)}
                        errorMessage={mensajeErroCorreo}
                    />
                </div>
                <div className="mb-4">
                    <InputField
                        label="Nombre usuario"
                        id="UserName"
                        type="text"
                        placeholder="Nombre usuario"
                        value={username}
                        onChange={(e) => handelUserName(e.target.value)}
                        errorMessage={mensajeErroUsername}
                    />

                </div>
                <div className="mb-4">
                    <InputField
                        label="Contraseña"
                        id="Contraseña"
                        type="text"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => handelPasword(e.target.value)}
                        onBlur={(e) => handleOnBulrPasword(e.target.value)}
                        errorMessage={mensajeErroPasword}
                    />

                    <div className="my-4 px-2">
                        <label htmlFor="ciudad" className="block text-gray-700 text-sm font-bold mb-2">
                            Ciudad
                        </label>
                        <select
                            id="ciudad"
                            className="w-full border border-gray-300 p-2 rounded-md"
                            value={ciudad}
                            onChange={(e) => handleCiudadChange(e.target.value)}
                        >
                            <option value="">Seleccionar ciudad</option>
                            {ciudades && ciudades.map((ciudad, index) => (
                                <option key={index} value={ciudad.nombre}>
                                    {ciudad.nombre}
                                </option>
                            ))}
                        </select>
                        {mensajeErrorCiudad && <p className="text-red-500 text-xs italic">{mensajeErrorCiudad}</p>}
                    </div>

                    <div className="mb-4">
                        <InputField
                            label="Dirección de Residencia"
                            id="direccionResidencia"
                            type="text"
                            placeholder="Dirección de Residencia"
                            value={direccionResidencia}
                            onChange={(e) => handleDireccionResidencia(e.target.value)}
                            errorMessage={mensajeErrorDireccion}
                        />
                    </div>

                </div>
                

                <div className='flex justify-between my-5 px-2'>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Registrar
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => { cerrar(false) }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
                
            </form>
        </div>
    );
};

export default RegistroClienteForm;
