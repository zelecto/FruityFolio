import React, { useState } from "react";
import PropTypes from "prop-types";
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
  Image,
  Textarea,
  
} from "@nextui-org/react";
import {
  CircleDollarSignIcon,
  FileTypeIcon,
  Package,
  ShoppingBasketIcon,
} from "lucide-react";

import { useFormik } from "formik";
import InputFieldForm from "../../Components/input_From";
import toast from "react-hot-toast";

const CrearProductoForm = () => {

  return (
    <div className="h-screen w-screen bg-[#F5F5F5] flex flex-col items-center">
      
      <Header title="FruityFolio" />

      <div className="w-2/3 h-full flex justify-center items-center">
        <TarjetaCrearProducto TextButton="Crear Producto" />
      </div>
    </div>
  );
};

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

export const TarjetaCrearProducto = ({
  TextButton,
  ActualizarProducto,
  actualizarListaProductos
}) => {
  // Esquema de validación usando Yup
  

  const [img, setImg] = useState(
    ActualizarProducto ? BuscarImagenNombre(ActualizarProducto.img) : null
  );

  const [imagenSeleccionada, setImagenSeleccionada] = useState(
    ActualizarProducto
      ? BuscarImagenNombre(ActualizarProducto.img)
      : { src: iconoGaleria, nombre: "Icono de Galería" }
  );

  const formik = useFormik({
    initialValues: {
      nombre: ActualizarProducto ? ActualizarProducto.name : "",
      stock: ActualizarProducto ? ActualizarProducto.stock : "",
      precio: ActualizarProducto ? ActualizarProducto.price : "",
      descripcion: ActualizarProducto ? ActualizarProducto.description : "",
    },
    validationSchema: schemaRegistrarProducto,
    onSubmit: async (values,{resetForm}) => {
      if (ActualizarProducto) {
        ActualizarProducto.name = values.nombre;
        ActualizarProducto.description = values.descripcion;
        ActualizarProducto.price = values.precio;
        ActualizarProducto.stock = values.stock;
        ActualizarProducto.img = img.nombre;

        const toastLoaing = toast.loading("Guardando...");
        const respuesta = await ActualizarProductos(ActualizarProducto);
        toast.dismiss(toastLoaing);

        if (!respuesta.error) {
          toast.success("Producto Actualizado");
          actualizarListaProductos();
        } else {
          toast.error(`${"Se a presentado un problema"}`);
        }
      } else if(img) {
        const producto = {
          name: values.nombre,
          description: values.descripcion,
          stock: values.stock,
          price: values.precio,
          img: img.nombre,
          username: usuario.username,
          activo: true,
        };
        const toastLoaing = toast.loading("Guardando...");
        const respuesta= await GuardarProducto(producto);
        toast.dismiss(toastLoaing);
        if (respuesta.datos) {
          toast.success("Producto Creado");
          setImagenSeleccionada(null);
          resetForm();
        } else {
          console.clear()
          console.log(respuesta.error)
          toast.error("Error no creado");
          toast.error(`${respuesta.error.data}`);
        }
      }else{
        toast.error("Selecione una imagen")
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
  
  const handelImg = (img) => {
    setImg(img);
  };

  const maxLength = 150;

  const usuario = JSON.parse(localStorage.getItem("user"));


  return (
    <div className="w-full  h-full flex justify-center items-center ">
      <form onSubmit={formik.handleSubmit} className="w-1/2 mx-5">
        <Card className=" ">
          <CardHeader>
            <h2 className="w-full text-center font-bold text-lg">
              Crea tu producto
            </h2>
          </CardHeader>

          <CardBody className="min-h-full">
            {inputConfigs.map((config) => (
              <div className="">
                <InputFieldForm
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
                formik.touched.descripcion && Boolean(formik.errors.descripcion)
              }
              errorMessage={
                formik.touched.descripcion && formik.errors.descripcion
              }
              description={`${maxLength - formik.values.descripcion.length} caracteres restantes`}
            />
          </CardBody>

          <CardFooter className="w-full flex justify-end">
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

      <Gallery
        imagenSeleccionada={imagenSeleccionada}
        setImagenSeleccionada={setImagenSeleccionada}
        handelImg={handelImg}
      ></Gallery>
    </div>
  );
};
TarjetaCrearProducto.propTypes = {
  TextButton: PropTypes.string.isRequired,
  ActualizarProducto: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    description: PropTypes.string,
    img: PropTypes.string,
  }),
  actualizarListaProductos: PropTypes.func.isRequired,
};

export default CrearProductoForm;

const Gallery = ({
  handelImg,
  imagenSeleccionada,
  setImagenSeleccionada,
}) => {
  const [imagenes, setImagenes] = useState(null);
  const [showSelecionImaganes, setSelecionImaganes] = useState(true);
  

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

  const handleOpenSeleccionImagen = (value) => {
    setImagenSeleccionada(value);
    setSelecionImaganes(true);
    setImagenes(null);
    handelImg(value);
  };

  return (
    <Card className="w-1/3 flex items-center shadow-2xl bg-white">
      <CardHeader>
        <h1 className="w-full text-4xl font-bold mb-2 text-center">IMÁGENES</h1>
      </CardHeader>

      <CardBody>
        {showSelecionImaganes && (
          <button
            className="flex flex-col bg-white justify-between overflow-hidden items-center w-full rounded-lg hover:bg-slate-200"
            onClick={() => ShowImagenes(true)}
          >
            <Image
              src={imagenSeleccionada ? imagenSeleccionada.src : iconoGaleria}
              alt=""
              className="w-[300px] h-[300px]"
            />
            <div>
              {imagenSeleccionada
                ? imagenSeleccionada.nombre
                : "Selecciona una imagen"}
            </div>
          </button>
        )}

        <div className="max-h-[460px] gap-2 grid grid-cols-2 sm:grid-cols-3 overflow-y-auto">
          {imagenes &&
            imagenes.map((item) => (
              <div key={item.alt}>
                <Card
                  shadow="sm"
                  isPressable
                  onClick={() => handleOpenSeleccionImagen(item)}
                >
                  <CardBody className="overflow-visible p-0">
                    <Image
                      isZoomed
                      shadow="sm"
                      radius="lg"
                      alt={item.name}
                      className="w-full object-contain h-[140px]"
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


Gallery.propTypes = {
  handelImg: PropTypes.func.isRequired,
  imagenSeleccionada: PropTypes.shape({
    src: PropTypes.string,
    nombre: PropTypes.string,
  }),
  setImagenSeleccionada: PropTypes.func.isRequired,
};

