import React, { useEffect, useState } from "react";
import { GetCiudades } from "../../../Base/bdCiudades.jsx";
import { GuardarCliente } from "../../../Base/BdUsuarios copy.jsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Fingerprint,
  User,
  Mail,
  AtSign,
  LockKeyhole,
  MapPin,
} from "lucide-react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import GenericFrom from "../../Components/generic_From.jsx";
import toast from "react-hot-toast";

const schemaReguistroCliente = Yup.object().shape({
  cedula: Yup.string()
    .matches(/^\d+$/, "Debe ser un número")
    .test(
      "len",
      "No se admiten más de 10 números",
      (val) => val && val.length <= 10
    )
    .min(10, "No se admiten menos de 10 números")
    .required("La cédula es requerida"),
  nombre: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "No se admiten números")
    .min(1,"No se admiten menos de 3 letras")
    .max(50,"No se admiten mas de 50 caracteres")
    .required("El nombre es requerido"),
  correo: Yup.string()
    .email("Correo electrónico no válido")
    .required("El correo es requerido"),
  username: Yup.string()
    .min(3, "No se admite menos de 3 caracteres")
    .max(50, "No puede tener más de 50 caracteres")
    .required("El username es requerido"),
  password: Yup.string()
    .min(8, "No se admite menos de 8 caracteres")
    .max(20, "No se admite más de 20 caracteres")
    .required("La contraseña es requerida"),
  direccionResidencia: Yup.string()
    .max(100, "No puede tener más de 100 caracteres")
    .required("La dirección de residencia es requerida"),
});

const RegistroClienteForm = () => {
  const [ciudades, setCiudades] = useState([]);
  const [ciudadResidencia, setCiudadResidencia] = useState(null);
  const [errorCiudadResidencia, setErrorCiudadResidencia] = useState(false);

  const handelCiudadResidencia = (e) => {
    
    if (ciudades.some((item) => item.nombre == e.target.value)) {
        setCiudadResidencia(e.target.value);
        setErrorCiudadResidencia(false);
    }else{
        setErrorCiudadResidencia(true);
    }
    
  };

  

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      cedula: "",
      nombre: "",
      correo: "",
      username: "",
      password: "",
      direccionResidencia:"",
    },
    validationSchema: schemaReguistroCliente,
    onSubmit: async (values) => {
      if (!errorCiudadResidencia) {
        const cliente = {
          username: values.username,
          nombre: values.nombre,
          cedula: values.cedula,
          correo: values.correo,
          password: values.password,
          ciudad: ciudadResidencia,
          direccionResidencia: values.direccionResidencia,
        };

        const toastLoaing = toast.loading("Guardando...");
        const respuesta = await GuardarCliente(cliente);
        toast.dismiss(toastLoaing);

        if (respuesta.datos) {
          toast.success("Cliente reguistrado");
          onOpenChange(false);
        } else {
          toast.error(`${respuesta.error.data}`);
        }
      } else {
        setErrorCiudadResidencia(true);
      }
    }
  });

  const inputConfigs = [
    {
      id: "direccionResidencia",
      label: "Dirección de Residencia",
      startContent: (
        <MapPin
          color={
            formik.touched.direccionResidencia &&
            Boolean(formik.errors.direccionResidencia)
              ? "#F31260"
              : "#338EF7"
          }
        ></MapPin>
      ),
    },
    {
      id: "cedula",
      label: "Cédula",
      startContent: (
        <Fingerprint
          color={
            formik.touched.cedula && Boolean(formik.errors.cedula)
              ? "#F31260"
              : "#338EF7"
          }
        ></Fingerprint>
      ),
    },
    {
      id: "nombre",
      label: "Nombre",
      startContent: (
        <User
          color={
            formik.touched.nombre && Boolean(formik.errors.nombre)
              ? "#F31260"
              : "#338EF7"
          }
        ></User>
      ),
    },
    {
      id: "correo",
      label: "Correo",
      startContent: (
        <Mail
          color={
            formik.touched.correo && Boolean(formik.errors.correo)
              ? "#F31260"
              : "#338EF7"
          }
        ></Mail>
      ),
    },
    {
      id: "username",
      label: "Username",
      startContent: (
        <AtSign
          color={
            formik.touched.username && Boolean(formik.errors.username)
              ? "#F31260"
              : "#338EF7"
          }
        ></AtSign>
      ),
    },
    {
      id: "password",
      label: "Password",
      startContent: (
        <LockKeyhole
          color={
            formik.touched.password && Boolean(formik.errors.password)
              ? "#F31260"
              : "#338EF7"
          }
        ></LockKeyhole>
      ),
    },
  ];

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


  return (
    <div>
      <Button
        onClick={onOpen}
        color="primary"
        variant="faded"
        className="text-blue-600 font-semibold w-full"
      >
        Registrate Clientes
      </Button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onBlur={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Registrar Usuario
                </h2>
              </ModalHeader>

              <ModalBody>
                <Select
                  isRequired
                  variant="faded"
                  labelPlacement="inside"
                  label="Ciudad de residencia"
                  placeholder="Seleciona una ciudad"
                  color="primary"
                  value={[ciudadResidencia]}
                  onChange={handelCiudadResidencia}
                  errorMessage={"Seleciona una ciudad"}
                  isInvalid={errorCiudadResidencia ? errorCiudadResidencia:false}
                >
                  <SelectItem key={"SinSelecion"}>
                    Seleciona una ciudad
                  </SelectItem>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad.nombre}>{ciudad.nombre}</SelectItem>
                  ))}
                </Select>
                <GenericFrom
                  formik={formik}
                  inputConfigs={inputConfigs}
                  textButton={"Crear"}
                ></GenericFrom>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RegistroClienteForm;
