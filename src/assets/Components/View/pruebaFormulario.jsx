import React from 'react';
import * as Yup from 'yup';
import { Button, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';


const userSchema = Yup.object().shape({
    username: Yup.string()
        .max(50, "No puede tener más de 50 caracteres")
        .required("Nombre de usuario es requerido"),
    password: Yup.string().
        max(20, "No se admite más de 20 caracteres").
        required("Contraseña es requerida"),
});

export const ValidationSchemaExample = () => {
    const formik = useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: userSchema,
      onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
        
      },
    });

    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <form onSubmit={formik.handleSubmit}>
        <div className="w-1/2 flex flex-col items-center">
          <Input
            color="primary"
            label="Username"
            className="my-5"
            variant="bordered"
            labelPlacement="outside"
            id="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.username && Boolean(formik.errors.username)
            }
            errorMessage={formik.touched.username && formik.errors.username}
          ></Input>
          <Input
            color="primary"
            className="my-5"
            variant="bordered"
            labelPlacement="outside"
            label="Password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.password && Boolean(formik.errors.password)
            }
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
            type={isVisible ? "text" : "password"}
          ></Input>
          <Button color="primary" variant="solid" type="submit">
            Submit
          </Button>
        </div>
      </form>
    );
}