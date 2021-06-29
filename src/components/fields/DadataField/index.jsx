import { useController } from "react-hook-form";

import InputControl from "./InputControl";
import ErrorTooltip from "../ErrorTooltip";
import { useUniqueId } from "hooks";

const DadataField = ({
  apiEndPoint,
  className,
  disabled,
  disablePast,
  dropDownMenuMaxHeight,
  inputProps,
  optionCodeFieldName,
  optionValueFieldName,
  placeholder,
  readOnly,
  regionId,
  ...useControllerProps
}) => {
  const {
    field: { onChange, value, ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);
  const id = useUniqueId();

  const onInputChange = (value) => {
    const updatedValue = { name: value };
    if (value) {
      updatedValue.cdiData = {};
    }
    onChange(updatedValue);
  };

  const onOptionSelect = (option) => onChange(option);
  return (
    <ErrorTooltip
      ref={ref}
      className={className}
      message={error?.message}
      target={id}
    >
      <InputControl
        apiEndPoint={apiEndPoint}
        disabled={disabled}
        disablePast={disablePast}
        dropDownMenuMaxHeight={dropDownMenuMaxHeight}
        fieldProps={fieldProps}
        id={id}
        invalid={!!error}
        inputProps={inputProps}
        onInputChange={onInputChange}
        onOptionSelect={onOptionSelect}
        optionCodeFieldName={optionCodeFieldName}
        optionValueFieldName={optionValueFieldName}
        placeholder={placeholder}
        readOnly={readOnly}
        regionId={regionId}
        value={value?.name ?? ""}
      />
    </ErrorTooltip>
  );
};

DadataField.defaultProps = {
  dropDownMenuMaxHeight: 300,
  optionCodeFieldName: "code",
  optionValueFieldName: "name",
  regionId: null,
};

export default DadataField;
