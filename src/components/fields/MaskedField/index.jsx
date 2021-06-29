import { Input } from "reactstrap";
import MaskedInput from "react-text-mask";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const MaskedField = ({
  className,
  disabled,
  inputMode,
  inputProps,
  mask,
  parse,
  pipe,
  placeholder,
  placeholderChar,
  readOnly,
  ...useControllerProps
}) => {
  const {
    field: { onChange, onBlur, ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  const handleBlur = (e) => {
    const regexp = new RegExp(`[${placeholderChar}]`);
    onChange(regexp.test(e.target.value) ? "" : e);
    onBlur();
  };

  const handleChange = (e) => {
    onChange(typeof parse === "function" ? parse(e.target.value) : e);
  };

  return (
    <ErrorTooltip
      ref={ref}
      className={className}
      message={error?.message}
      tabIndex={-1}
      target={id}
    >
      <MaskedInput
        keepCharPositions
        mask={mask}
        pipe={pipe}
        placeholderChar={placeholderChar}
        {...inputProps}
        {...fieldProps}
        onBlur={handleBlur}
        onChange={handleChange}
        render={(ref, props) => (
          <Input
            autoComplete="off"
            disabled={disabled}
            id={id}
            innerRef={ref}
            invalid={!!error}
            placeholder={placeholder}
            readOnly={readOnly}
            {...props}
          />
        )}
      />
    </ErrorTooltip>
  );
};

export default MaskedField;
