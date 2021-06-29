import { Button, ButtonGroup } from "reactstrap";
import { useController } from "react-hook-form";
import cn from "classnames";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const ButtonsField = ({
  block,
  buttonGroupProps,
  className,
  disabled,
  equalWidth,
  optionCodeFieldName,
  options,
  optionValueFieldName,
  renderButtonName,
  trueOrFalse,
  ...useControllerProps
}) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  return (
    <ErrorTooltip
      ref={ref}
      className={className}
      message={error?.message}
      tabIndex={-1}
      target={id}
    >
      <ButtonGroup
        className={cn(block && "d-flex")}
        id={id}
        {...buttonGroupProps}
      >
        {options.map((el) => {
          const handleClick = () =>
            onChange(trueOrFalse ? el[optionCodeFieldName] : el);
          const outline = trueOrFalse
            ? el[optionCodeFieldName] !== value
            : el[optionCodeFieldName] !== value?.[optionCodeFieldName];
          return (
            <Button
              key={el[optionCodeFieldName]}
              className={cn(block && equalWidth && "w-100")}
              color={error ? "danger" : "primary"}
              disabled={disabled}
              onClick={handleClick}
              outline={outline}
            >
              {typeof renderButtonName === "function"
                ? renderButtonName(el)
                : el[optionValueFieldName]}
            </Button>
          );
        })}
      </ButtonGroup>
    </ErrorTooltip>
  );
};

ButtonsField.defaultProps = {
  block: true,
  equalWidth: true,
  optionCodeFieldName: "code",
  options: [],
  optionValueFieldName: "name",
};

export default ButtonsField;
