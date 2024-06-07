import React, { useState } from "react";
import * as Yup from "yup";
import { MensajeAlert } from "../../../Tools/Validadores.jsx";
import { useFormik } from "formik";
import GenericFrom from "../../Components/generic_From.jsx";
import { AtSign, Fingerprint, LockKeyhole, Mail, User } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";

import { GuardarUsuario } from "../../../Base/BdUsuarios.jsx";
import toast from "react-hot-toast";

const validationSchemaUsuario = Yup.object({
  cedula: Yup.string()
    .matches(/^\d+$/, "No se admiten caracteres")
    .min(10, "No se admiten menos de 10 numeros")
    .max(10, "No se admiten más de 10 números")
    .required("La cédula es obligatoria"),
  nombre: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "No se admiten números")
    .min(3, "No se admiten menos de 3 caracteres")
    .max(50, "No se admiten mas de 50 caracteres")
    .trim()
    .required("El nombre es obligatorio")
    .test(
      "no-empty",
      "El nombre no puede estar vacío",
      (value) => value.trim() !== ""
    ),
  correo: Yup.string()
    .email("Correo electrónico no válido")
    .min(3, "No se admiten menos de 3 caracteres")
    .max(50, "No se admiten mas de 50 caracteres")
    .trim()
    .required("El correo es obligatorio")
    .test(
      "no-empty",
      "El correo no puede estar vacío",
      (value) => value.trim() !== ""
    ),
  username: Yup.string()
    .min(3, "No se admiten menos de 3 letras")
    .max(50, "No se admiten mas de 50 caracteres")
    .trim()
    .required("El nombre de usuario es obligatorio")
    .test(
      "no-empty",
      "El nombre de usuario no puede estar vacío",
      (value) => value.trim() !== ""
    ),
  password: Yup.string()
    .min(8, "No se admite menos de 8 caracteres")
    .max(20, "No se admite más de 20 caracteres")
    .trim()
    .required("La contraseña es obligatoria")
    .test(
      "no-empty",
      "La contraseña no puede estar vacía",
      (value) => value.trim() !== ""
    ),
});

const RegistroUsuarioForm = ({ cerrar }) => {
  //modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const formik = useFormik({
    initialValues: {
      cedula: "",
      nombre: "",
      correo: "",
      username: "",
      password: "",
    },
    validationSchema: validationSchemaUsuario,
    onSubmit: async (values) => {
      const nuevoUsuario = {
        cedula: values.cedula,
        nombre: values.nombre,
        correo: values.correo,
        username: values.username,
        password: values.password,
      };

      const toastLoding = toast.loading("Guardando...");
      const data = await GuardarUsuario(nuevoUsuario);
      toast.dismiss(toastLoding);
      if (data.datos) {
        toast.success("Usuario reguistrado");
        onOpenChange(false);
      } else {
        toast.error(`${data.error.data}`);
      }
    },
  });

  const inputConfigs = [
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

  return (
    <div>
      <Button
        onClick={onOpen}
        color="primary"
        variant="faded"
        className="text-blue-600 font-semibold w-full"
      >
        Registrate Admin
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

export default RegistroUsuarioForm;
