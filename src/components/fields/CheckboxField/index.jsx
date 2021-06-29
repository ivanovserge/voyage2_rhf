import { CustomInput } from "reactstrap";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const CheckboxField = ({
  className,
  disabled,
  inputProps,
  label,
  readOnly,
  type,
  ...useControllerProps
}) => {
  const {
    field: { value, ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  return (
    <ErrorTooltip className={className} message={error?.message} target={id}>
      <CustomInput
        checked={value}
        disabled={disabled}
        id={id}
        innerRef={ref}
        invalid={!!error}
        label={label}
        readOnly={readOnly}
        type={type}
        {...inputProps}
        {...fieldProps}
      />
    </ErrorTooltip>
  );
};

CheckboxField.defaultProps = {
  type: "checkbox",
};

export default CheckboxField;
