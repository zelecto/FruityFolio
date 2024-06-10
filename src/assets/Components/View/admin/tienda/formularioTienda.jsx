import React, { useEffect, useState } from "react";
import { GuardarTienda } from "../../../Base/BdtiendaVirtual";

import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SelectItem,
  Select,
} from "@nextui-org/react";
import { HomeIcon, Store } from "lucide-react";
import InputField from "../../Components/input_From";
import { GetCiudades } from "../../../Base/bdCiudades";
import PropTypes from "prop-types";
const schemaReguistroTienda = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre de la tienda es requerido")
    .matches(/^[a-zA-Z\s]*$/, "No se admiten números"),
    ciudad: Yup.string().required("Por favor selecciona una ciudad"),
  direccion: Yup.string().required("La dirección es requerida"),
});

const TiendaFormulario = ({ handelshowReguistrarTienda }) => {
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    async function fetchCiudades() {
      try {
        const ciudadesFromDB = await GetCiudades(); // función que obtiene las ciudades desde la base de datos
        setCiudades(ciudadesFromDB.datos);
      } catch (error) {
        console.error("Error al obtener ciudades:", error);
      }
    }
    fetchCiudades();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      ciudad: "",
      direccion: "",
    },
    validationSchema: schemaReguistroTienda,
    onSubmit: async (values) => {
        const usuario = JSON.parse(localStorage.getItem("user"));
        const tienda = {
          username: usuario.username,
          nombre: values.nombre,
          ciudad: values.ciudad,
          direccion: values.direccion,
        };
        const respuesta = await GuardarTienda(tienda);
        if (respuesta.error == null) {
          handelshowReguistrarTienda(false);
          window.location.reload();
        } else {
          console.log("a ocurrido un error");
        }
    },
  });

  const inputConfigs = [
    {
      id: "nombre",
      label: "Nombre",
      startContent: (
        <Store
          color={
            formik.touched.nombre && Boolean(formik.errors.nombre)
              ? "#F31260"
              : "#338EF7"
          }
        ></Store>
      ),
    },
    {
      id: "direccion",
      label: "direccion",
      startContent: (
        <HomeIcon
          color={
            formik.touched.precio && Boolean(formik.errors.precio)
              ? "#F31260"
              : "#338EF7"
          }
        ></HomeIcon>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      
    }
  };
  const handleChangeExternal = (newValue) => {
    
  };


  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        color="primary"
        className="text-lg font-bold px-5"
        onClick={onOpen}
      >
        Crear
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>
            <h1 className="w-full text-center font-bold">
              Crea tu tienda virtual
            </h1>
          </ModalHeader>
          <ModalBody>
            <div className="w-full">
              <form onSubmit={formik.handleSubmit}>
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

                <Select
                  id="ciudad"
                  variant="faded"
                  labelPlacement="inside"
                  label="Ciudad de residencia"
                  placeholder="Seleccione una ciudad"
                  color="primary"
                  value={formik.values.ciudad}
                  onChange={(e)=> {formik.setFieldValue("ciudad", e.target.value);}}
                  errorMessage={formik.touched.ciudad && formik.errors.ciudad}
                  isInvalid={
                    formik.touched.ciudad && Boolean(formik.errors.ciudad)
                  }
                >
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad.nombre} value={ciudad.nombre}>
                      {ciudad.nombre}
                    </SelectItem>
                  ))}
                </Select>

                <Button
                  type="submit"
                  color="success"
                  size="md"
                  className="w-1/4 font-bold text-xl text-white"
                >
                  Crear
                </Button>
              </form>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
TiendaFormulario.propTypes = {
  handelshowReguistrarTienda: PropTypes.func.isRequired,
};

export default TiendaFormulario;
