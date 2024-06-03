import React, { useState } from "react";
import { MensajeAlert } from "../../../Tools/Validadores";
import RegistroUsuarioForm from "./ReguistrarUsuario";
import Logo from "../../../Photo/logo.png";
import PersonaFactura  from "../../../Photo/PersonaFactura.svg";
import ClienteCompras from "../../../Photo/ClienteCarritoCompras.svg";


import { FormularioLogin } from "../../form/login/formulario_Inicio_Sesion";
import { Button, Image } from "@nextui-org/react";
import RegistroClienteForm from "./ReguistrarCliente";


export const LoginScreen = () => {
  const [mensaje, setMensaje] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handelShowReguistrarUsuario = (value) => {
    setShowReguistar(value);
  };


  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-[#F5F5F5]">
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

      <div className="w-3/4 flex h-full bg-[#338EF7] justify-between rounded-xl shadow-lg">
        <div className="bg-white w-full h-full py-10 px-20 rounded-l-xl">
          <div className="flex flex-col items-center">
            <img
              src={Logo}
              alt="Logo Frutiolio"
              className="w-52 items-center flex"
            />
            <h1 className="font-bold text-4xl">Bienvenido de nuevo</h1>
          </div>
          <div>
            <h3 className="font-bold text-gray-500 text-lg py-4">
              ¡Bienvenido de nuevo! Por favor, ingrese sus datos.
            </h3>
          </div>

          <FormularioLogin
            setMensaje={setMensaje}
            setShowAlert={setShowAlert}
          ></FormularioLogin>
        </div>

        <div className="w-full min-h-full text-white ">
          <div className="p-6 h-full flex flex-col justify-between">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Bienvenido a FruityFolio
            </h1>

            <div className="flex font-semibold justify-between mb-4">
              <p className="text-lg flex flex-col min-h-full justify-between">
                Nuestro software ofrece una plataforma completa para administrar
                frutas, ventas, facturación y una tienda virtual con diversas
                herramientas adicionales.
                <RegistroUsuarioForm></RegistroUsuarioForm>
              </p>
              <Image
                src={PersonaFactura}
                width={400}
                height={400}
                className="mx-5"
              ></Image>
            </div>

            <div className="flex font-semibold justify-between mb-4">
              <p className="text-lg flex flex-col min-h-full justify-between">
                Los usuarios pueden crear una cuenta de cliente para realizar
                compras en las tiendas locales, brindando una experiencia
                personalizada y conveniente.
                <RegistroClienteForm></RegistroClienteForm>
              </p>
              <Image
                src={ClienteCompras}
                width={400}
                height={400}
                className="mx-5"
              ></Image>
            </div>

            <p className="text-lg font-bold text-center">
              ¡Únete hoy y aprovecha todas nuestras ventajas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardRegistro = ({ imgUrl, title, texto, textbutton, openRegistro }) => {
  return (
    <div className="bg-white h-full rounded-md shadow-md p-5 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center">{title}</h1>
      <img src={imgUrl} alt="" className="w-96 my-8 rounded " />
      <p className="text-lg font-semibold">{texto}</p>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold text-lg p-2 rounded-md my-8"
        onClick={() => openRegistro(true)}
      >
        {textbutton}
      </button>
    </div>
  );
};


export default LoginScreen;
