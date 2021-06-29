import { CustomInput } from "reactstrap";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const RangeField = ({
  className,
  disabled,
  inputProps,
  max,
  min,
  step,
  ...useControllerProps
}) => {
  const {
    field: { ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  return (
    <ErrorTooltip className={className} message={error?.message} target={id}>
      <CustomInput
        disabled={disabled}
        id={id}
        innerRef={ref}
        invalid={!!error}
        max={max}
        min={min}
        step={step}
        type="range"
        {...inputProps}
        {...fieldProps}
      />
    </ErrorTooltip>
  );
};

RangeField.defaultProps = {
  max: 100,
  min: 0,
  step: 1,
};

export default RangeField;
