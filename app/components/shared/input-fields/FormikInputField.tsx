import { ErrorMessage, useFormikContext } from "formik";
import InputField from "./InputFields";

const FormikInputField = ({ name , ...props }: any) => {
    const { setFieldValue, setFieldTouched } = useFormikContext();
  
    const handleChange = (event: any) => {
      const { name, value } = event.target;
      setFieldValue(name, value);
    };
  
    const handleBlur = (event: any) => {
      const { name } = event.target;
      setFieldTouched(name, true);
    };
  
    return (
      <div className="w-full mt-8">
        <InputField
          name={name}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-xs"
        />
      </div>
    );
  };

  export default FormikInputField;