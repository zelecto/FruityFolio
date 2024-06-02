import React, { useState } from "react";
import validarNombre from "../../../Tools/Validadores";
import { ErrorMensaje, MensajeAlert } from "../../../Tools/Validadores";
import Header from "../../Header";
import { BuscarImagenNombre, ImagenDefecto } from "../../../Logic/Defaultimage";


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
    <div className="h-screen w-screen bg-[#F5F5F5] flex flex-col">
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
        title="FruityFolio"
      />
      
      <div className="flex-grow flex justify-center items-center">
        <div className="flex items-center justify-center w-full">
          <TarjetaCrearProducto
            TextButton="Crear Producto"
            handelSetMensaje={handelSetMensaje}
            handelOpenAlert={handelOpenAlert}
          />
        </div>

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
    <div className="flex w-3/4 justify-center ">
      <div className="w-[450px] h-[700px] overflow-auto max-h-[650px] mx-10">
        <form
          onSubmit={handleSubmit}
          className="min-w-1/2"
        >
          <Card className="bg-white">
            <CardHeader>
              <h2 className="w-full text-center font-bold text-lg">Crea tu producto</h2>
            </CardHeader>

            <CardBody className="w-full">
                <div className="my-2">
                <InputField
                  label="Nombre del producto"
                  id="nombre"
                  type="text"
                  startContent={<ShoppingBasketIcon color={mensaje ? "#F31260" : "#338EF7"}></ShoppingBasketIcon>}
                  placeholder="Nombre del producto"
                  value={nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  errorMessage={mensaje}
                />
                </div>

                <div className="my-2">
                <InputField
                  label="Stock"
                  id="stock"
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  startContent={<Package color={mensaje1 ? "#F31260" : "#338EF7"}></Package>}
                  onChange={(e) => handleStockChange(e.target.value)}
                  errorMessage={mensaje1}
                />
                </div>
               
              <div className="my-2">
                <InputField
                  label="Precio"
                  id="precio"
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  startContent={<CircleDollarSignIcon color={mensaje2 ? "#F31260" : "#338EF7"}></CircleDollarSignIcon>}
                  onChange={(e) => handlePrecioChange(e.target.value)}
                  errorMessage={mensaje2}
                />
              </div>
            
              <Textarea
                  id="descripcion"
                  label="Descripción"
                  placeholder="Descripción"
                  labelPlacement="outside"
                  variant="bordered"
                  color="primary"
                  value={descripcion}
                  startContent={<FileTypeIcon color="#338EF7"></FileTypeIcon>}
                  onChange={handleDescripcionChange}
                  description={`${maxLength - descripcion.length} caracteres restantes`}
                />
                
            </CardBody>

            <CardFooter className="w-full justify-end">
              <Button
                type="submit"
                color="success"
                className="font-bold text-lg text-white"
              >
                {TextButton}
              </Button>
            </CardFooter>
          </Card>
        
        </form>
      </div>

      <div className="w-1/3 h-1/2 overflow-y-auto p-2 rounded-lg  mx-5">
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
  onBlur,
  startContent,
  size
}) => {
  return (
    <Input
      id={id}
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      startContent={startContent}
      type={type}
      variant="bordered"
      color="primary"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      size={size}
      isInvalid={errorMessage ? true : false}
      errorMessage={errorMessage}
    >

    </Input>
  );
};

import iconoGaleria from "../../../Icons/IconoGaleria.png";
import { ActualizarProductos, GuardarProducto } from "../../../Base/BdProductos";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Image, Input, Textarea } from "@nextui-org/react";
import { CircleDollarSignIcon, FileTypeIcon, Package, ShoppingBasketIcon } from "lucide-react";
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
  const handleOpenSelecionImagen = (value) => {
    setimagenSelecionada(value);
    
    setSelecionImaganes(true)
    setImagenes(false)
    handelImg(value);

  }

  const handelImagenSelecionada = (value, index) => {
    setimagenSelecionada(value);
    handleClick(index);
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="w-full text-4xl font-bold mb-2 text-center">IMAGENES</h1>
      </CardHeader>

      <CardBody>
        {showSelecionImaganes && (
          <button
            className="flex flex-col bg-white justify-between overflow-hidden items-center w-[350px] max-w-[350px]   m-10 rounded-lg hover:bg-slate-200"
            onClick={() => ShowImagenes(true)}
          >
            <Image
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

        
          <div className="max-h-[460px] gap-2 grid grid-cols-2 sm:grid-cols-3 overflow-y-auto">
            {imagenes && (
            imagenes.map((item, index) => (
              <div key={index}>
                <Card shadow="sm" isPressable onClick={() => handleOpenSelecionImagen(item)}>
                  <CardBody className="overflow-visible p-0">
                    <Image
                      isZoomed
                      shadow="sm"
                      radius="lg"
                      alt={item.name}
                      className="w-full object-cover h-[140px]"
                      src={item.src}
                    />
                  </CardBody>
                  <CardFooter className="text-small justify-between">
                    {item.nombre}
                  </CardFooter>
                </Card>
              </div>
            )))}
            
          
        </div>


      </CardBody>

      <CardFooter></CardFooter>
    </Card>
  );
};

