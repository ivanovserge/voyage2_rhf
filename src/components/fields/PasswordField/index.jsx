import * as React from "react";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const PasswordField = ({
  buttonColor,
  className,
  disabled,
  disablePast,
  inputProps,
  placeholder,
  ...useControllerProps
}) => {
  const {
    field: { ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const [showPassword, setShowPassword] = React.useState(false);
  const id = useUniqueId();

  const handleAddonClick = () => {
    setShowPassword((show) => !show);
  };

  const handlePast = (e) => {
    disablePast && e.preventDefault();
  };

  return (
    <ErrorTooltip className={className} message={error?.message} target={id}>
      <InputGroup id={id}>
        <Input
          autoComplete="off"
          disabled={disabled}
          innerRef={ref}
          invalid={!!error}
          onPaste={handlePast}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...inputProps}
          {...fieldProps}
        />
        <InputGroupAddon addonType="append">
          <Button
            disabled={disabled}
            onClick={handleAddonClick}
            outline
            color={buttonColor}
          >
            <FontAwesomeIcon
              fixedWidth
              icon={showPassword ? faEye : faEyeSlash}
            />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </ErrorTooltip>
  );
};

PasswordField.defaultProps = {
  buttonColor: "primary",
};

export default PasswordField;
