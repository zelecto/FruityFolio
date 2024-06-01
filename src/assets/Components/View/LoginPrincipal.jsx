import React, { useState } from "react";
import { InputField } from "./CrearProducto";
import { MensajeAlert } from "../Tools/Validadores";
import RegistroUsuarioForm from "./ReguistrarUsuario";
import Logo from "../Photo/logo.png";
import Pregunta from "../Photo/PreguntaAdministracion.png";
import Ordenes from "../Photo/ClienteCompra.jpg";
import { CircleChevronLeft } from 'lucide-react';
import { CircleChevronRight } from 'lucide-react';
import RegistroClienteForm from "./ReguistrarCliente";
import { GetCuentaUsuario } from "../Base/BdInicioSecion";
export const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [mensajeErroUsername, setMensajeErroUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mensajeErroPasword, setMensajeErroPasword] = useState("");
    const [mensaje, setMensaje] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [showReguistrar, setShowReguistar] = useState(false);
    const [showReguistrarCliente, setShowReguistrarCliente] = useState(false);

    const handelUserName = (newValue) => {
        if (newValue.length <= 50 || newValue === "") {
            setUsername(newValue);
            setMensajeErroUsername("");
        } else {
            setMensajeErroUsername("No puede tener más de 50 caracteres");
        }
    }

    const handelPasword = (newValue) => {
        if ((newValue.length <= 20) || newValue === "") {
            setPassword(newValue);
            setMensajeErroPasword("");
        } else {
            setMensajeErroPasword("No se admite más de 20 caracteres");
        }
    }

    const onClickiniciarSecion = async () => {
        const { datos, error } = await GetCuentaUsuario(username,password);
        if (datos && password === datos.cuenta.password) {
            localStorage.setItem('token', datos.token); 
            switch (datos.tipo) {
                case "Usuario":
                    console.log("Entre");
                    window.location.href = '/paginaPrincipal';
                    localStorage.setItem('user', JSON.stringify(datos.cuenta));
                    
                    setMensaje({});
                    break;
                case "ClienteUsuario":
                    window.location.href = '/PaginaPrincipalClient';
                    localStorage.setItem('user', JSON.stringify(datos.cuenta));
                    setMensaje({});
                    break;
                default:
                    break;
            }
        }
        else {
            setMensaje({
                title: "No se pudo iniciar sesión",
                Mensaje: "Intente de nuevo",
                colorBoton: "blue",
                colorText: "text-black-700",
                isError: true,
                textBoton: "ACEPTAR"
            });
            setShowAlert(true);
        }
    }

    const handelShowReguistrarUsuario = (value) => {
        setShowReguistar(value);
    }

    const handelShowReguistrarCliente = (value) => {
        setShowReguistrarCliente(value);
    };


    const listCardRegistro = [
        <CardRegistro
            key="1"
            imgUrl={Pregunta}
            title="¿Tienes una fruteria?"
            texto="¡Crea una cuenta de administradory accede a increíbles opciones para simplificar la gestión de tu negocio de frutas y ventas!"
            textbutton={"Crear cuenta de administrador"}
            openRegistro={handelShowReguistrarUsuario}
        />,
        <CardRegistro
            key="2"
            imgUrl={Ordenes}
            title="¿Quieres disfrutar de las mejores frutas?"
            texto="Regístrate como cliente y ordena ahora las frutas más frescas desde la comodidad de tu hogar."
            textbutton={"Crea una cuenta"}
            openRegistro={handelShowReguistrarCliente}

        />

    ];

    return (
        <div className="w-screen h-screen flex justify-between bg-[#F5F5F5]">
            {showAlert && (
                <MensajeAlert
                    message={mensaje.Mensaje}
                    title={mensaje.title}
                    onClose={() => setShowAlert(false)}
                    isError={mensaje.isError}
                    buttonColor={mensaje.colorBoton}
                    textColor={mensaje.colorText}
                    buttonText={mensaje.textBoton}
                />
            )}

            {showReguistrar && (
                <div className="backdrop-blur-sm fixed w-full h-full flex flex-col-reverse justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="w-1/2 flex items-center justify-center">
                        <RegistroUsuarioForm cerrar={handelShowReguistrarUsuario} />
                    </div>
                </div>
            )}
            {showReguistrarCliente && (
                <div className="backdrop-blur-sm fixed w-full h-full flex flex-col-reverse justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="w-1/2 flex items-center justify-center">
                        <RegistroClienteForm cerrar={handelShowReguistrarCliente} />
                    </div>
                </div>
            )}

            <div className="w-3/4 px-20 py-10">
                <div className="bg-white h-full py-10 px-20 rounded shadow-lg">
                    <div className="flex flex-col items-center">
                        <img src={Logo} alt="Logo Frutiolio" className="w-52 items-center flex" />
                        <h1 className="font-bold text-4xl">Bienvenido de nuevo</h1>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-lg py-4">¡Bienvenido de nuevo! Por favor, ingrese sus datos.</h3>
                    </div>

                    <div className="my-5 text-lg">
                        <InputField
                            label="Nombre Usuario"
                            id="Nombre Usuario"
                            type="text"
                            placeholder="Nombre Usuario"
                            value={username}
                            onChange={(e) => handelUserName(e.target.value)}
                            errorMessage={mensajeErroUsername}
                            pading={"py-5"}
                        />
                    </div>

                    <div className="my-5 text-lg">
                        <InputField
                            label="Contraseña"
                            id="Contraseña"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => handelPasword(e.target.value)}
                            errorMessage={mensajeErroPasword}
                            pading={"py-5"}
                        />
                    </div>

                    <button
                        className="my-10 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={onClickiniciarSecion}
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>

            <div className="bg-gray-200 w-1/2 flex items-center justify-center backdrop-blur-sm">
                <div className="p-20">
                    <Carrusel slider={listCardRegistro} />
                </div>
            </div>
        </div>
    );
}

const CardRegistro = ({ imgUrl, title, texto, textbutton, openRegistro }) => {
    return (
        <div className="bg-white h-full rounded-md shadow-md p-5 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center">{title}</h1>
            <img src={imgUrl} alt="" className="w-96 my-8 rounded " />
            <p className="text-lg font-semibold">
                {texto}
            </p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold text-lg p-2 rounded-md my-8"
                onClick={() => openRegistro(true)}
            >
                {textbutton}
            </button>
        </div>
    );
}


const Carrusel = ({ slider = [] }) => {
    const [curr, setCurr] = useState(0);

    const next = () => {
        setCurr((curr) => (curr === slider.length - 1 ? 0 : curr + 1));
    };

    const prev = () => {
        setCurr((curr) => (curr === 0 ? slider.length - 1 : curr - 1));
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform ease-out duration-500"
                style={{ transform: `translateX(-${curr * 100}%)` }}>
                {slider.map((slide, index) => (
                    <div className="w-full flex-shrink-0" key={index}>
                        {slide}
                    </div>
                ))}
            </div>
            <button onClick={prev} className="absolute top-1/2 left-4 transform -translate-y-1/2  p-2 rounded-full shadow-md">
                <CircleChevronLeft size={40}></CircleChevronLeft>
            </button>
            <button onClick={next} className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full shadow-md">
                <CircleChevronRight size={40}></CircleChevronRight>
            </button>
        </div>
    );
}

export default LoginScreen;
