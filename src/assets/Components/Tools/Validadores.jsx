import React, { useState, useEffect } from "react";

let validarNombre = (nombre) => {
  const onlyLetters = /^[A-Za-z]+$/;
  return onlyLetters.test(nombre);
};

export const ErrorMensaje = (mensaje,w) => {
  return (
    <div>
      {mensaje && (
        <div>
          <div
            className={
              w +
              " bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            }
          >
            {mensaje}
          </div>
        </div>
      )}
    </div>
  );
};





export let MensajeAlert = ({
  message,
  onClose,
  isError,
  buttonColor,
  textColor,
  buttonText,
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };
  
  return (
    <>
      {show && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-end relative">
            <p className={`text-xl ${textColor}`}>{message}</p>
            <button
              onClick={handleClose}
              className={`mt-4 text-white font-bold py-2 px-4 rounded ${colorClasses[buttonColor]}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
const colorClasses = {
  red: "bg-red-600 hover:bg-red-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  green: "bg-green-600 hover:bg-green-700",
  // Agrega más colores según sea necesario
};

export default validarNombre;
