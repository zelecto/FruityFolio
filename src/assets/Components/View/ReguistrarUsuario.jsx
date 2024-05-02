import React, { useState } from 'react';
import { InputField } from './Facturadora';
import validarNombre, { MensajeAlert } from '../Tools/Validadores';
import { GuardarUsuario } from '../Base/BdUsuarios.jsx';
const RegistroUsuarioForm = ({ cerrar }) => {


    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
        const nuevoUsuario = {
            cedula: cedula,
            nombre: nombre,
            correo: correo,
            username: username,
            password: password
        };

        if (mensajeErroCedula && mensajeErroCorreo && mensajeErroNombre && mensajeErroPasword && mensajeErroUsername
            || nombre == "" && cedula == "" && username == "" && correo == "" && password == "") {
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
            GuardarUsuarioNuevo(nuevoUsuario);
        }

    };

    const GuardarUsuarioNuevo = async (usuario) => {

        const respuesta = await GuardarUsuario(usuario);
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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            {showMensaje && (
                <div className="fixed top-0 left-0 w-full h-full flex flex-col-reverse justify-center items-center bg-gray-900 bg-opacity-50 z-50">

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
            <h2 className="text-2xl font-semibold mb-4">Registro de Usuario</h2>
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

                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Registrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistroUsuarioForm;
