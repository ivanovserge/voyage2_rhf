import * as React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
} from "reactstrap";
import Highlighter from "react-highlight-words";
import axios from "axios";
import qs from "qs";

import { UP, DOWN, BACKSPACE, ESC } from "./constants";

const InputControl = ({
  apiEndPoint,
  disabled,
  disablePast,
  dropDownMenuMaxHeight,
  fieldProps,
  id,
  invalid,
  inputProps,
  onInputChange,
  onOptionSelect,
  optionCodeFieldName,
  optionValueFieldName,
  placeholder,
  readOnly,
  regionId,
  value,
}) => {
  const [options, setOptions] = React.useState([]);
  const [activeOptionIndex, setActiveOptionIndex] = React.useState();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const cancelTokenSourceRef = React.useRef(null);

  const selectOption = (option) => {
    setActiveOptionIndex();
    onOptionSelect(option);
  };

  React.useEffect(() => {
    (disabled || readOnly) && setIsDropdownOpen(false);
  }, [disabled, readOnly]);

  const handleInputChange = async (e) => {
    const { value } = e.target;

    cancelTokenSourceRef.current?.cancel();

    onInputChange(value);

    if (!value) {
      setOptions([]);
      setIsDropdownOpen(false);
      return;
    }

    cancelTokenSourceRef.current = axios.CancelToken.source();
    try {
      const res = await axios({
        url: apiEndPoint,
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          operation: "Dadata.get",
          ns: "B2C",
          data: JSON.stringify({
            value,
            field: "addressCdi",
            regionId,
          }),
        }),
        withCredentials: true,
        cancelToken: cancelTokenSourceRef.current.token,
      });

      const options = res.data?.data || [];
      setOptions(options);
      setIsDropdownOpen(!!options.length);
    } catch (err) {}
  };

  const handleInputKeyDown = (e) => {
    const { key, keyCode } = e;

    if (isDropdownOpen) {
      if (keyCode === ESC) {
        setIsDropdownOpen(false);
      }

      if (keyCode === UP) {
        e.preventDefault();
        setActiveOptionIndex((idx) =>
          idx === undefined || idx === 0 ? options.length - 1 : idx - 1
        );
      }

      if (keyCode === DOWN) {
        e.preventDefault();
        setActiveOptionIndex((idx) =>
          idx === undefined || idx === options.length - 1 ? 0 : idx + 1
        );
      }

      if (key === "Enter") {
        selectOption(options[activeOptionIndex]);
        setIsDropdownOpen(false);
      }
    } else if (options.length) {
      if (keyCode === BACKSPACE) {
        setIsDropdownOpen(true);
      }

      if (keyCode === UP || keyCode === DOWN) {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
    }
  };

  const handleInputPast = (e) => {
    disablePast && e.preventDefault();
  };

  const onDropdownToggle = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else if (options.length) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <Dropdown id={id} isOpen={isDropdownOpen} toggle={onDropdownToggle}>
      <DropdownToggle className="position-relative" tag="div">
        <Input
          autoComplete="off"
          disabled={disabled}
          invalid={invalid}
          onKeyDown={handleInputKeyDown}
          onPaste={handleInputPast}
          placeholder={placeholder}
          readOnly={readOnly}
          {...inputProps}
          {...fieldProps}
          onChange={handleInputChange}
          value={value}
        />
      </DropdownToggle>
      <DropdownMenu
        className="w-100"
        modifiers={{
          setMaxHeight: {
            enabled: true,
            order: 890,
            fn: (data) => ({
              ...data,
              styles: {
                ...data.styles,
                maxHeight: dropDownMenuMaxHeight,
                overflow: "auto",
              },
            }),
          },
        }}
      >
        {options.map((el, idx) => (
          <DropdownItem
            key={`${el[optionCodeFieldName]} ${el[optionValueFieldName]}`}
            active={idx === activeOptionIndex}
            className="text-wrap"
            onClick={() => selectOption(el)}
            tag="div"
          >
            <Highlighter
              autoEscape
              highlightStyle={{
                padding: 0,
                color: "inherit",
                backgroundColor: "transparent",
                fontWeight: "bold",
              }}
              searchWords={value.split(" ")}
              textToHighlight={el[optionValueFieldName]}
            />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default InputControl;
