import React, { useState } from "react";
import validarNombre from "../Tools/Validadores";
import { ErrorMensaje, MensajeAlert } from "../Tools/Validadores";
import Header from "./Header";
import { BuscarImagenNombre, ImagenDefecto } from "../Logic/Defaultimage";

const CrearProductoForm = () => {
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

  const handelSetMensaje = (mensaje) => {
    setMensaje(mensaje);
  };

  return (
    <div className="h-screen w-screen bg-[#F5F5F5]">
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
      <Header
        link="/paginaPrincipal"
        logoRightSrc="ruta-a-la-imagen-derecha.jpg"
        logoAlt="FruityFolio logo"
        title="FruityFolio"
        subtitle="Añade un producto a tu catálogo."
      />
      <div className="flex items-center justify-center mx-auto mt-5 ">
        <TarjetaCrearProducto
          TextButton="Crear Producto"
          handelSetMensaje={handelSetMensaje}
          handelOpenAlert={handelOpenAlert}
        />
      </div>
    </div>
  );
};

export const TarjetaCrearProducto = ({
  TextButton,
  handelSetMensaje,
  handelOpenAlert,
  ActualizarProducto
}) => {
  //variables
  const [nombre, setNombre] = useState(
    ActualizarProducto ? ActualizarProducto.name : ""
  );
  const [stock, setStock] = useState(
    ActualizarProducto ? ActualizarProducto.stock : ""
  );
  const [precio, setPrecio] = useState(
    ActualizarProducto ? ActualizarProducto.price : ""
  );
  const [descripcion, setDescripcion] = useState(
    ActualizarProducto ? ActualizarProducto.description : ""
  );

  const [img, setImg] = useState(ActualizarProducto ? BuscarImagenNombre(ActualizarProducto.img) : null);
  const handelImg = (img) => {
    setImg(img);
  }


  // mensaje de error respectivamente en los inputs
  const [mensaje, setMensaje] = useState(null);
  const [mensaje1, setMensaje1] = useState(null);
  const [mensaje2, setMensaje2] = useState(null);

  const handleNombreChange = (newValue) => {
    const mensaje =
      "El nombre no puede contener números ni caracteres especiales";

    if (validarNombre(newValue) || newValue === "") {
      setNombre(newValue);
      setMensaje(null);
    } else {
      setNombre("");
      setMensaje([mensaje]);
    }
  };

  const handleStockChange = (newValue) => {
    const mensaje = "Solo se admiten números mayores a 0";
    if (newValue > 0) {
      setStock(newValue);
      setMensaje1(null);
    } else {

      setStock("");
      setMensaje1(mensaje);
    }
  };

  const handlePrecioChange = (newValue) => {
    const mensaje = "Solo se admiten números mayores a 0";

    if (newValue > 0) {
      setPrecio(newValue);
      setMensaje2(null);
    } else {
      setPrecio("");
      setMensaje2(mensaje);
    }
  };

  const maxLength = 150;

  const handleDescripcionChange = async (e) => {
    const { value } = e.target;
    if (value.length <= maxLength) {
      setDescripcion(value);
    }
  };
  const usuario = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(img.nombre);
    if (validarNombre(nombre) && nombre !== "" && stock !== "" && precio && img) {
      //Actualizar producto
      if (ActualizarProducto) {
        ActualizarProducto.name = nombre;
        ActualizarProducto.description = descripcion;
        ActualizarProducto.price=precio;
        ActualizarProducto.stock = stock;
        ActualizarProducto.img = img.nombre;

        const respuesta = await ActualizarProductos(ActualizarProducto);

        if (respuesta.error == null) {
          console.log(respuesta)
          const mensajeActualizacion = {
            Mensaje: "PRODUCTO ACTUALIZADO CORRECTAMENTE",
            colorBoton: "green",
            colorText: "text-black-700",
            isError: true,
            textBoton: "ACEPTAR",
          };
          handelSetMensaje(mensajeActualizacion);
          handelOpenAlert();

        }
      } else {
        const producto = {
          name: nombre,
          description: descripcion,
          stock: stock,
          price: precio,
          img: img.nombre,
          username: usuario.username,
          activo: true
        }

        const mensajeGuardado = {
          Mensaje: "Datos guardados correctamente",
          colorBoton: "green",
          colorText: "text-black-700",
          isError: true,
        };

        handelSetMensaje(mensajeGuardado);
        handelOpenAlert();
        GuardarProducto(producto);
        // Recargar la página solo si los datos se guardan correctamente
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Recargar después de 2 segundos
      }

    } else {
      const mensajeError = {
        Mensaje: "Datos no guardados, verifique y reintente",
        colorBoton: "red",
        colorText: "text-black-700",
        isError: true,
        textBoton: "Cerrar",
      };

      handelSetMensaje(mensajeError);
      handelOpenAlert();
    }

  }


  return (
    <div className=" flex">
      <div className="w-[450px] h-[700px] overflow-auto max-h-[650px] mx-10">
        <form
          onSubmit={handleSubmit}
          className="shadow-2xl rounded px-8 pt-6 pb-8 mb-4 bg-[#CCE6FF] "
        >
          <div className="mx-5 mb-4">
            <InputField
              label="Nombre del producto"
              id="nombre"
              type="text"
              placeholder="Nombre del producto"
              value={nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
              errorMessage={mensaje}
            />

            <InputField
              label="Stock"
              id="stock"
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => handleStockChange(e.target.value)}
              errorMessage={mensaje1}
            />

            <InputField
              label="Precio"
              id="precio"
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => handlePrecioChange(e.target.value)}
              errorMessage={mensaje2}
            />

            <label
              htmlFor="descripcion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={handleDescripcionChange}
              className="resize-none shadow appearance-none border rounded w-full h-[100px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:bg-gray-200"
            />
            <p className="text-sm text-gray-500 mb-2">
              {maxLength - descripcion.length} caracteres restantes
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 mt-6 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {TextButton}
            </button>
          </div>
        </form>
      </div>

      <div className=" w-[400px] h-[500px] overflow-y-auto bg-[#CCE6FF]  p-2 rounded-lg  mx-10 shadow-xl">
        <Gallery
          imagen={ActualizarProducto ? BuscarImagenNombre(ActualizarProducto.img) : null}
          handelImg={handelImg}
        >

        </Gallery>


      </div>
    </div>
  );
};

export default CrearProductoForm;

export const InputField = ({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
  pading
}) => {
  return (
    <div className="my-4">
      <label
        htmlFor={id}
        className="block text-gray-700 font-bold mb-2"
      >
        {label}
      </label>
      <div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`shadow appearance-none border rounded w-full h-full ${pading ? pading : "py-2"} px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:bg-gray-200`}
        />
        {errorMessage && ErrorMensaje(errorMessage, "w-full")}
      </div>
    </div>
  );
};

import iconoGaleria from "../Icons/IconoGaleria.png";
import { ActualizarProductos, GuardarProducto } from "../Base/BdProductos";
const Defaultimage = ImagenDefecto();

const Gallery = ({ imagen, handelImg }) => {
  const [imagenes, setImagenes] = useState(null);
  const [showSelecionImaganes, setSelecionImaganes] = useState(true);
  const [imagenSelecionada, setimagenSelecionada] = useState(imagen ? imagen : null);
  const [activeButtons, setActiveButtons] = useState(
    Array(Defaultimage.length).fill(false)
  );

  //console.log(imagenSelecionada)

  const handleClick = (index) => {

    const newActiveButtons = Array(Defaultimage.length).fill(false);

    newActiveButtons[index] = true;
    setActiveButtons(newActiveButtons);
  };

  const ShowImagenes = (Show) => {
    const image = ImagenDefecto();
    if (Show) {
      setImagenes(image);
      setSelecionImaganes(false);
    } else {
      setImagenes(null);
      setSelecionImaganes(true);
    }
  }
  const handleOpenSelecionImagen = () => {
    setSelecionImaganes(true)
    setImagenes(false)
    handelImg(imagenSelecionada);

  }

  const handelImagenSelecionada = (value, index) => {
    setimagenSelecionada(value);
    handleClick(index);
  };


  return (
    <div className="flex flex-col justify-center items-center ">
      <h1 className=" text-4xl font-bold mb-2 text-center">IMAGENES</h1>
      {showSelecionImaganes && (
        <button
          className="flex flex-col bg-white justify-between overflow-hidden items-center w-[350px] max-w-[350px]   m-10 rounded-lg hover:bg-slate-200"
          onClick={() => ShowImagenes(true)}
        >
          <img
            src={imagenSelecionada ? imagenSelecionada.src : iconoGaleria}
            alt=""
            className="w-[300px] h-[300px]"
          />
          <div>
            {imagenSelecionada
              ? imagenSelecionada.nombre
              : "Selecciona una imagen"}
          </div>
        </button>
      )}

      {imagenes && (
        <div>
          <div className="flex flex-wrap items-cente h-[350px] overflow-auto justify-center ">
            {imagenes.map((image, index) => (
              <div className="" key={index}>
                <button
                  className={`flex items-center justify-center w-[100px] h-[100px] relative overflow-hidden rounded-lg hover:bg-slate-200 
                  transition-transform duration-300 transform hover:scale-125 m-2
                  ${activeButtons[index] ? "bg-slate-400" : "bg-white hover:bg-slate-200 "}`}
                >
                  <img
                    src={image.src}
                    alt={`Imagen ${index}`}
                    className="w-full h-full "
                    onClick={() => {
                      handelImagenSelecionada(image, index);
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className=" bg-green-500 hover:bg-green-700 text-white font-bold rounded p-2 focus:outline-none focus:shadow-outline mt-5"
              onClick={() => handleOpenSelecionImagen()}
            >
              ACEPTAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
