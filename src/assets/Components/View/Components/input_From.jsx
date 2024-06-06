import { Input } from "@nextui-org/react";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";

const InputFieldForm = ({ config, formik, startContent }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Input
      color="primary"
      label={config.label}
      size="lg"
      className="my-5"
      variant="bordered"
      labelPlacement="outside"
      startContent={startContent}
      id={config.id}
      type={config.id == "password" && !isVisible ? "password" : "text"}
      endContent={
        config.id == "password" ? (
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeOff className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        ) : null
      }
      value={formik.values[config.id]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      isInvalid={formik.touched[config.id] && Boolean(formik.errors[config.id])}
      errorMessage={formik.touched[config.id] && formik.errors[config.id]}
    />
  );
};

export default InputFieldForm;
