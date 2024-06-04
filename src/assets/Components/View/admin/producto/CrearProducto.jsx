import React, { useState } from "react";
import validarNombre from "../../../Tools/Validadores";
import { ErrorMensaje, MensajeAlert } from "../../../Tools/Validadores";
import Header from "../../Header";
import { BuscarImagenNombre, ImagenDefecto } from "../../../Logic/Defaultimage";
import iconoGaleria from "../../../Icons/IconoGaleria.png";
import * as Yup from "yup";
import {
  ActualizarProductos,
  GuardarProducto,
} from "../../../Base/BdProductos";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  CircleDollarSignIcon,
  FileText,
  FileTypeIcon,
  Package,
  ShoppingBasketIcon,
} from "lucide-react";
import { useFormik } from "formik";
import InputField from "../../Components/input_From";
import toast from "react-hot-toast";
const Defaultimage = ImagenDefecto();

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
      <Header title="FruityFolio" />

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
  ActualizarProducto,
}) => {
  // Esquema de validación usando Yup
  const schemaRegistrarProducto = Yup.object().shape({
    nombre: Yup.string()
      .matches(
        /^[A-Za-z]+$/,
        "El nombre no puede contener números ni caracteres especiales"
      )
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .required("El nombre es obligatorio"),
    stock: Yup.number()
      .typeError("Debe ser un número")
      .max(999999, "No se admite valores mayores a 999999")
      .min(1, "El minimo es 1")
      .required("El stock es obligatorio"),
    precio: Yup.number()
      .typeError("Debe ser un número")
      .max(999999, "No se admite valores mayores a 999999")
      .min(1, "El minimo es 1")
      .required("El precio es obligatorio"),
    descripcion: Yup.string().max(
      150,
      "La descripción no puede tener más de 150 caracteres"
    ),
  });

  const formik = useFormik({
    initialValues: {
      nombre: ActualizarProducto ? ActualizarProducto.name : "",
      stock: ActualizarProducto ? ActualizarProducto.stock : "",
      precio: ActualizarProducto ? ActualizarProducto.price : "",
      descripcion: ActualizarProducto ? ActualizarProducto.description : "",
    },
    validationSchema: schemaRegistrarProducto,
    onSubmit: async (values) => {

      if (ActualizarProducto) {
        ActualizarProducto.name = values.nombre;
        ActualizarProducto.description = values.descripcion;
        ActualizarProducto.price = values.precio;
        ActualizarProducto.stock = values.stock;
        ActualizarProducto.img = img.nombre;

        const respuesta = await ActualizarProductos(ActualizarProducto);

        const toastLoaing = toast.loading("Guardando...");
        toast.dismiss(toastLoaing);

        if (respuesta.datos) {
          toast.success("Producto Actualizado");
        } else {
          toast.error(`${respuesta.error.data}`);
        }
      } else {
        const producto = {
          name: values.nombre,
          description: values.descripcion,
          stock: values.stock,
          price: values.precio,
          img: img.nombre,
          username: usuario.username,
          activo: true,
        };

        const respuesta= await GuardarProducto(producto);
        if (respuesta.datos) {
          toast.success("Producto Creado");
          resetForm(); 
          setImg(null); 
        } else {
          console.clear()
          console.log(respuesta.error)
          toast.error(`${respuesta.error.data}`);
        }
      }
    },
  });

  const inputConfigs = [
    {
      id: "nombre",
      label: "Nombre",
      startContent: (
        <ShoppingBasketIcon
          color={
            formik.touched.nombre && Boolean(formik.errors.nombre)
              ? "#F31260"
              : "#338EF7"
          }
        ></ShoppingBasketIcon>
      ),
    },
    {
      id: "stock",
      label: "Stock",
      startContent: (
        <Package
          color={
            formik.touched.stock && Boolean(formik.errors.stock)
              ? "#F31260"
              : "#338EF7"
          }
        ></Package>
      ),
    },
    {
      id: "precio",
      label: "Precio",
      startContent: (
        <CircleDollarSignIcon
          color={
            formik.touched.precio && Boolean(formik.errors.precio)
              ? "#F31260"
              : "#338EF7"
          }
        ></CircleDollarSignIcon>
      ),
    },
  ];

  const [img, setImg] = useState(
    ActualizarProducto ? BuscarImagenNombre(ActualizarProducto.img) : null
  );
  const handelImg = (img) => {
    setImg(img);
  };

  const maxLength = 150;

  const usuario = JSON.parse(localStorage.getItem("user"));


  return (
    <div className="flex w-3/4 justify-center ">
      <div className="w-[450px] h-[700px] overflow-auto max-h-[800px] mx-10">
        <form onSubmit={formik.handleSubmit} className="min-w-1/2">
          <Card className="bg-white">
            <CardHeader>
              <h2 className="w-full text-center font-bold text-lg">
                Crea tu producto
              </h2>
            </CardHeader>

            <CardBody className="w-full">
              {inputConfigs.map((config) => (
                <div className="">
                  <InputField
                    key={config.id}
                    config={config}
                    formik={formik}
                    startContent={config.startContent}
                  />
                </div>
              ))}

              <Textarea
                id="descripcion"
                label="Descripción"
                placeholder="Descripción"
                labelPlacement="outside"
                variant="bordered"
                color="primary"
                startContent={
                  <FileTypeIcon
                    color={
                      formik.touched.descripcion &&
                      Boolean(formik.errors.descripcion)
                        ? "#F31260"
                        : "#338EF7"
                    }
                  ></FileTypeIcon>
                }
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.descripcion &&
                  Boolean(formik.errors.descripcion)
                }
                errorMessage={
                  formik.touched.descripcion && formik.errors.descripcion
                }
                description={`${maxLength - formik.values.descripcion.length} caracteres restantes`}
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
          imagen={
            ActualizarProducto
              ? BuscarImagenNombre(ActualizarProducto.img)
              : null
          }
          handelImg={handelImg}
        ></Gallery>
      </div>
    </div>
  );
};

export default CrearProductoForm;

const Gallery = ({ imagen, handelImg }) => {
  const [imagenes, setImagenes] = useState(null);
  const [showSelecionImaganes, setSelecionImaganes] = useState(true);
  const [imagenSelecionada, setimagenSelecionada] = useState(
    imagen ? imagen : null
  );
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
  };
  const handleOpenSelecionImagen = (value) => {
    setimagenSelecionada(value);

    setSelecionImaganes(true);
    setImagenes(false);
    handelImg(value);
  };

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
            className="flex flex-col bg-white justify-between overflow-hidden items-center w-full max-w-[350px]   m-10 rounded-lg hover:bg-slate-200"
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
          {imagenes &&
            imagenes.map((item, index) => (
              <div key={index}>
                <Card
                  shadow="sm"
                  isPressable
                  onClick={() => handleOpenSelecionImagen(item)}
                >
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
            ))}
        </div>
      </CardBody>

      <CardFooter></CardFooter>
    </Card>
  );
};
