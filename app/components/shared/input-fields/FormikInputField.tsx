import { ErrorMessage, useFormikContext } from "formik";
import InputField from "./InputFields";

const FormikInputField = ({
  name,
  /** Override outer wrapper margin. Default `mt-8` kept for older screens; use `mt-0` when a Label sits directly above the field (e.g. grid rows next to date pickers). */
  wrapperClassName = "mt-8",
  ...props
}: any) => {
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
      <div className={`w-full ${wrapperClassName}`}>
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