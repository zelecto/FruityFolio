import React, { useState } from "react";
import RegistroUsuarioForm from "./ReguistrarUsuario";
import { ConsultarUsuario } from "../Base/BdUsuarios";
import { InputField } from './Facturadora';
import { MensajeAlert } from "../Tools/Validadores";

const Login = () => {
  const [showReguistrar, setShowReguistar] = useState(false);
  PruebaBD();
  const handelShowReguistrar = (value) => {
    setShowReguistar(value);
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensajeErroUsername, setMensajeErroUsername] = useState("");
  const handelUserName = (newValue) => {
    if (newValue.length <= 50 || newValue === "") {
      setUsername(newValue);
      setMensajeErroUsername("");
    } else {
      setMensajeErroUsername("No puede tener mas de 50 caracteres");
    }
  }
  const [mensajeErroPasword, setMensajeErroPasword] = useState("");
  const handelPasword = (newValue) => {
    if ((newValue.length <= 20) || newValue === "") {
      setPassword(newValue);
      setMensajeErroPasword("");
    } else {
      setMensajeErroPasword("no se admite mas de 20 carecteres");
    }
  }
  const CloseShowReguistrar = () => {
    setShowReguistar(false);
  }

  const onClickiniciarSecion = async () => {
    const { datos, error } = await ConsultarUsuario(username)
  
    if (datos&& password===datos.password) {
      window.location.href = '/paginaPrincipal';
      localStorage.setItem('user', JSON.stringify(datos));
      handelSetMensaje(null);
      
    }else{
      const mensajeError = {
        Mensaje: "No se pudo inciar secion verifique su usuario o contraseña",
        colorBoton: "red",
        colorText: "text-black-700",
        isError: true,
        textBoton: "ACEPTAR"
      };
      setMensaje(mensajeError);
      handelOpenAlert();
    }
  }

  //Mensaje de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [mensaje, setMensaje] = useState({
    Mensaje: "",
    colorBoton: "",
    colorText: "",
    isError: false,
    textBoton: "",
  });



  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handelOpenAlert = () => {
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {showReguistrar && (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col-reverse justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="w-[800px]">
              <RegistroUsuarioForm cerrar={handelShowReguistrar}></RegistroUsuarioForm>
            </div>
          </div>
          
      )}

      {showAlert && (
        <MensajeAlert
          message={mensaje.Mensaje}
          onClose={handleCloseAlert}
          isError={mensaje.isError}
          buttonColor={mensaje.colorBoton}
          textColor={mensaje.colorText}
          buttonText={mensaje.textBoton}
        />
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex flex-col justify-between">

          <div className="my-5">
            <InputField
              label="Nombre Usuario"
              id="Nombre Usuario"
              type="text"
              placeholder="Nombre Usuario"
              value={username}
              onChange={(e) => handelUserName(e.target.value)}
              errorMessage={mensajeErroUsername}
            />
          </div>

          <div className="my-5">
            <InputField
              label="Contraseña"
              id="Contraseña"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => handelPasword(e.target.value)}
              //onBlur={(e) => handleOnBulrPasword(e.target.value)}
              errorMessage={mensajeErroPasword}
            />
          </div>

          <div className="flex items-center justify-between my-5">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => handelShowReguistrar(true)}
              >
                Registrarse
              </a>
            </div>
          </div>

          <div>

            <button

              className="my-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => onClickiniciarSecion()}
            >
              Iniciar sesión
            </button>


          </div>

        </div>

      </div>
    </div>
  );
};

import axios from 'axios';
const PruebaBD=async ()=>{
  try {
    const nuevoUsuario = {
      cedula: "147",
      nombre: " ",
      correo: "ascc",
      username: "asd",
      password: "asdds"
    };
    const respuesta = await axios.post('https://localhost:7208/api/Usuarios', nuevoUsuario);
    console.log(respuesta)
    return { datos: respuesta.data, error: null };
  } catch (error) {
    console.log(error)
    return { datos: null, error: error };

  }
}
export default Login;
