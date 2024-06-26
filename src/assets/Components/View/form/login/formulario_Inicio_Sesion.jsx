import React, {  useState } from "react";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import { GetCuentaUsuario } from "../../../Base/BdInicioSecion";
import { AtSign, Eye, EyeOff, LockKeyhole } from "lucide-react";
import PropTypes from "prop-types";


const userSchema = Yup.object().shape({
  username: Yup.string()
    .max(50, "No puede tener más de 50 caracteres")
    .required("Nombre de usuario es requerido"),
  password: Yup.string()
    .max(20, "No se admite más de 20 caracteres")
    .required("Contraseña es requerida"),
});

export const FormularioLogin = ({setMensaje,setShowAlert}) => {
  const [isLoading,setIsLoading]=useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const { datos } = await GetCuentaUsuario(values.username, values.password);
      if (datos!=null && values.password === datos.cuenta.password) {
        console.log(datos);
        localStorage.setItem("token", datos.token);
        switch (datos.tipo) {
          
          case "Usuario":
            window.location.href = "/paginaPrincipal";
            localStorage.setItem("user", JSON.stringify(datos.cuenta));
            setMensaje({});
            setIsLoading(false);
            break;
          case "ClienteUsuario":
            window.location.href = "/PaginaPrincipalClient";
            localStorage.setItem("user", JSON.stringify(datos.cuenta));
            setMensaje({});
            setIsLoading(false);
            break;
          default:
            break;
        }
      } else {
        setMensaje({
          title: "No se pudo iniciar sesión",
          Mensaje: "Intente de nuevo",
          colorBoton: "blue",
          colorText: "text-black-700",
          isError: true,
          textBoton: "ACEPTAR",
        });
        setIsLoading(false);
        setShowAlert(true);
      }
    },
  });

  const [isVisible, setIsVisible] = React.useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="w-full flex flex-col items-center">
        <Input
          color="primary"
          label="Username"
          size="lg"
          className="my-5"
          variant="bordered"
          labelPlacement="outside"
          startContent={
            <AtSign
              color={
                formik.touched.username && Boolean(formik.errors.username)
                  ? "#F31260"
                  : "#338EF7"
              }
            ></AtSign>
          }
          id="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.username && Boolean(formik.errors.username)}
          errorMessage={formik.touched.username && formik.errors.username}
        ></Input>

        <Input
          color="primary"
          className="my-5"
          size="lg"
          variant="bordered"
          labelPlacement="outside"
          label="Password"
          startContent={
            <LockKeyhole
              color={
                formik.touched.password && Boolean(formik.errors.password)
                  ? "#F31260"
                  : "#338EF7"
              }
            ></LockKeyhole>
          }
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.password && Boolean(formik.errors.password)}
          errorMessage={formik.touched.password && formik.errors.password}
          type={isVisible ? "password" : "text"}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <Eye className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        ></Input>

        {!isLoading ? (
          <Button
            color="primary"
            variant="ghost"
            type="submit"
            className="w-1/2 p-2 my-5"
          >
            Entrar
          </Button>
        ) : (
          <Button
            isLoading
            color="primary"
            variant="ghost"
            type="submit"
            className="w-1/2 p-2 my-5"
          >
            Entrar
          </Button>
        )}
      </div>
    </form>
  );
};

FormularioLogin.propTypes = {
  setMensaje: PropTypes.func.isRequired,
  setShowAlert: PropTypes.func.isRequired,
};