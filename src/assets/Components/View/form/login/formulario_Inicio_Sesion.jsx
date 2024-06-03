import React from "react";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import { GetCuentaUsuario } from "../../../Base/BdInicioSecion";
import { Eye, EyeOff } from "lucide-react";



const userSchema = Yup.object().shape({
  username: Yup.string()
    .max(50, "No puede tener más de 50 caracteres")
    .required("Nombre de usuario es requerido"),
  password: Yup.string()
    .max(20, "No se admite más de 20 caracteres")
    .required("Contraseña es requerida"),
});

export const FormularioLogin = ({setMensaje,setShowAlert}) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      const { datos, error } = await GetCuentaUsuario(values.username, values.password);
      if (datos!=null && values.password === datos.cuenta.password) {
        console.log(datos);
        localStorage.setItem("token", datos.token);
        switch (datos.tipo) {
          
          case "Usuario":
            window.location.href = "/paginaPrincipal";
            localStorage.setItem("user", JSON.stringify(datos.cuenta));
            setMensaje({});
            break;
          case "ClienteUsuario":
            window.location.href = "/PaginaPrincipalClient";
            localStorage.setItem("user", JSON.stringify(datos.cuenta));
            setMensaje({});
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
        setShowAlert(true);
      }
    },
  });

  const [isVisible, setIsVisible] = React.useState(false);

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
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.password && Boolean(formik.errors.password)}
          errorMessage={formik.touched.password && formik.errors.password}
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

        <Button
          color="primary"
          variant="ghost"
          type="submit"
          className="w-1/2 p-2 my-5"
        >
          Entrar
        </Button>
      </div>
    </form>
  );
};
