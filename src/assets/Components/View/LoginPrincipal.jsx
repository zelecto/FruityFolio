import { useState } from "react";
import { InputField } from "./CrearProducto";
import { ConsultarUsuario } from "../Base/BdUsuarios";
import { MensajeAlert } from "../Tools/Validadores";
import RegistroUsuarioForm from "./ReguistrarUsuario";
import Logo from "../Photo/logo.png";
import Pregunta from "../Photo/PreguntaAdministracion.png";
export const LoginScreen = () => {
    //UserName
    const [username, setUsername] = useState("");

    const handelUserName = (newValue) => {
        if (newValue.length <= 50 || newValue === "") {
            setUsername(newValue);
            setMensajeErroUsername("");
        } else {
            setMensajeErroUsername("No puede tener mas de 50 caracteres");
        }
    }
    const [mensajeErroUsername, setMensajeErroUsername] = useState("");

    //Pasword
    const [password, setPassword] = useState("");
    const [mensajeErroPasword, setMensajeErroPasword] = useState("");

    const handelPasword = (newValue) => {
        if ((newValue.length <= 20) || newValue === "") {
            setPassword(newValue);
            setMensajeErroPasword("");
        } else {
            setMensajeErroPasword("no se admite mas de 20 carecteres");
        }
    }

    //inicio de sesion
    const [mensaje, setMensaje] = useState({
        Mensaje: "",
        colorBoton: "",
        colorText: "",
        isError: false,
        textBoton: "",
    });

    const onClickiniciarSecion = async () => {
        const { datos, error } = await ConsultarUsuario(username)

        if (datos && password === datos.password) {
            window.location.href = '/paginaPrincipal';
            localStorage.setItem('user', JSON.stringify(datos));
            handelSetMensaje(null);

        } else {
            const mensajeError = {
                title: "No se pudo iniciar sesión",
                Mensaje: "intente de nuevo",
                colorBoton: "blue",
                colorText: "text-black-700",
                isError: true,
                textBoton: "ACEPTAR"
            };
            setMensaje(mensajeError);
            handelOpenAlert();
        }
    }

    //Alerta
    const [showAlert, setShowAlert] = useState(false);
    const handelOpenAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    //reguistrar 

    const handelShowReguistrar = (value) => {
        setShowReguistar(value);
    }

    const [showReguistrar, setShowReguistar] = useState(false);
    return (
        <div className="w-screen h-screen flex justify-between bg-[#F5F5F5]">
            {showAlert && (
                <MensajeAlert
                    message={mensaje.Mensaje}
                    title={mensaje.title}
                    onClose={handleCloseAlert}
                    isError={mensaje.isError}
                    buttonColor={mensaje.colorBoton}
                    textColor={mensaje.colorText}
                    buttonText={mensaje.textBoton}
                />
            )}

            {showReguistrar && (
                <div className="backdrop-blur-sm fixed  w-full h-full flex flex-col-reverse justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="w-1/2 flex items-center justify-center">
                        <RegistroUsuarioForm cerrar={handelShowReguistrar}></RegistroUsuarioForm>
                    </div>
                </div>

            )}
            <div className=" w-1/2 px-20 py-10">
                <div className="bg-white h-full py-10 px-20 rounded shadow-lg">
                    <div className="flex flex-col items-center ">
                        <img src={Logo} alt="Logo Frutiolio" className="w-52 items-center flex" />
                        <h1 className=" font-bold text-4xl">Bienvenido de nuevo</h1>
                    </div>
                    <div>

                        <h3 className=" font-bold text-gray-500 text-lg py-4 ">¡Bienvenido de nuevo! Por favor, ingrese sus datos.</h3>
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
                        onClick={() => onClickiniciarSecion()}
                    >
                        Iniciar sesión
                    </button>

                    <div className="flex items-center justify-between my-5">
                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-lg text-blue-500 hover:text-blue-700"
                                onClick={() => handelShowReguistrar(true)}
                            >
                                ¿No tienes cuenta? Regístrate aquí.
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-300 w-1/2 flex items-center justify-center backdrop-blur-sm">
                <div className="">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-center">¿Tienes una fruteria?</h1>
                        <img src={Pregunta} alt="" className="w-96 my-8 rounded" />
                        <p className="text-lg font-semibold">
                            ¡Crea una cuenta de administrador <br /> accede a increíbles opciones para simplificar la gestión de tu negocio de frutas y ventas!
                        </p>
                        <button className="bg-green-400 hover:bg-green-600 text-white font-bold text-lg p-2 rounded-md my-8"
                            onClick={(e) => { handelShowReguistrar(true) }}
                        >
                            
                            Crear cuenta administrador
                        </button>
                    </div>
                </div>
            </div>


        </div>
    )
}