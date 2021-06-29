import { Input } from "reactstrap";
import MaskedInput from "react-text-mask";
import { useController } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const PhoneField = ({
  className,
  disabled,
  inputProps,
  placeholder,
  ...useControllerProps
}) => {
  const {
    field: { onBlur, ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  /**
   * Проверяем формат номера телефона.
   * Несмотря на маску, на некоторых iOS-устройствах при автозаполнении происходит вставка без круглых скобок и тире.
   * Поэтому в случае непрохождения проверки регуляркой и при условии, что введено 11 цифр, - преобразуем к нужному формату.
   */
  const handleBlur = (e) => {
    let { value } = e.target;
    const isValid = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/.test(value);
    const digits = value.replace(/\D/g, "");
    const { onChange } = fieldProps;

    if (!isValid) {
      value =
        digits.length === 11
          ? digits.replace(
              /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
              "+$1($2)$3-$4-$5"
            )
          : "";
      onChange(value);
    }
    onBlur();
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
        mask={[
          "+",
          "7",
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
        ]}
        {...inputProps}
        {...fieldProps}
        onBlur={handleBlur}
        render={(ref, props) => (
          <Input
            autoComplete="off"
            disabled={disabled}
            id={id}
            innerRef={ref}
            inputMode="numeric"
            invalid={!!error}
            placeholder={placeholder}
            {...props}
          />
        )}
      />
    </ErrorTooltip>
  );
};

export default PhoneField;
