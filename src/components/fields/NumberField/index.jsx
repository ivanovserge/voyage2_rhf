import { Input } from "reactstrap";
import NumberFormat from "react-number-format";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const NumberField = ({
  className,
  allowNegative,
  decimalScale,
  decimalSeparator,
  disabled,
  fixedDecimalScale,
  inputProps,
  maxLength,
  placeholder,
  parse,
  readOnly,
  thousandSeparator,
  ...useControllerProps
}) => {
  const {
    field: { onChange, ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  const handleChange = (e) => {
    onChange(typeof parse === "function" ? parse(e.target.value) : e);
  };

  return (
    <ErrorTooltip className={className} message={error?.message} target={id}>
      <NumberFormat
        allowNegative={allowNegative}
        autoComplete="off"
        customInput={Input}
        decimalScale={decimalScale}
        decimalSeparator={decimalSeparator}
        disabled={disabled}
        fixedDecimalScale={fixedDecimalScale}
        id={id}
        innerRef={ref}
        inputMode="numeric"
        invalid={!!error}
        maxLength={maxLength}
        placeholder={placeholder}
        readOnly={readOnly}
        thousandSeparator={thousandSeparator}
        {...inputProps}
        {...fieldProps}
        onChange={handleChange}
      />
    </ErrorTooltip>
  );
};

NumberField.defaultProps = {
  decimalScale: 2,
  decimalSeparator: ",",
  fixedDecimalScale: true,
  maxLength: 20,
  thousandSeparator: " ",
};

export default NumberField;
