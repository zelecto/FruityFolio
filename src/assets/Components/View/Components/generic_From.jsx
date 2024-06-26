import { Button } from "@nextui-org/react";
import InputFieldForm from "./input_From";
import PropTypes from "prop-types";
const GenericFrom = ({ formik, inputConfigs, textButton }) => (
  <form onSubmit={formik.handleSubmit}>
    {inputConfigs.map((config) => (
      <div key={config.id} className="my-5">
        <InputFieldForm
          key={config.id}
          config={config}
          formik={formik}
          startContent={config.startContent}
        />
      </div>
    ))}
    <div className="w-full flex justify-end">
      <Button type="submit" variant="solid" className="w-1/2" color="success">
        <p className="text-white font-bold text-lg">{textButton}</p>
      </Button>
    </div>
  </form>
);

GenericFrom.propTypes = {
  formik: PropTypes.object.isRequired,
  inputConfigs: PropTypes.array.isRequired,
  textButton: PropTypes.string.isRequired,
};


export default GenericFrom;