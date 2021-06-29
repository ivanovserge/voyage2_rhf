import * as React from "react";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  Popover,
} from "reactstrap";
import MaskedInput from "react-text-mask";
import autoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { format, getTime, isValid, parse, startOfMonth } from "date-fns";

import Calendar from "./Calendar";
import { useDateField } from "./";

const InputControl = ({
  disabled,
  inputProps,
  invalid,
  placeholder,
  prepend,
  readOnly,
}) => {
  const calendarToggleBtn = React.useRef(null);
  const pipe = React.useMemo(() => autoCorrectedDatePipe("dd.mm.yyyy"), []);
  const {
    calendarPlacement,
    date,
    fieldProps,
    isCalendarOpen,
    parse: parseValue,
    setIsCalendarOpen,
    setMonth,
    setViewMode,
  } = useDateField();

  const onCalendarToggle = () => {
    setIsCalendarOpen(false);
    setMonth(startOfMonth(date));
    setViewMode("days");
  };

  const onChange = (e) => {
    const { value } = e.target;
    const parsedFromString = parse(value, "dd.MM.yyyy", 0);
    let updatedValue = isValid(parsedFromString)
      ? getTime(parsedFromString)
      : value;
    if (typeof parseValue === "function") {
      updatedValue = parseValue(updatedValue);
    }
    fieldProps.onChange(updatedValue);
  };

  const onKeyDown = (e) => {
    const selectionStart = Number(e.currentTarget.selectionStart);
    const keyCode = Number(e.keyCode);

    if (selectionStart === 0 && keyCode === 8) {
      e.preventDefault();
      e.currentTarget.value = "";
      fieldProps.onChange(e);
    }
  };

  return (
    <>
      <InputGroup>
        {prepend && (
          <InputGroupAddon addonType="prepend">{prepend}</InputGroupAddon>
        )}
        <MaskedInput
          keepCharPositions
          mask={[/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]}
          pipe={pipe}
          {...inputProps}
          {...fieldProps}
          onChange={onChange}
          render={(ref, props) => (
            <Input
              autoComplete="off"
              disabled={disabled}
              innerRef={ref}
              inputMode="numeric"
              invalid={invalid}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              readOnly={readOnly}
              {...props}
            />
          )}
          value={
            typeof fieldProps.value === "number"
              ? format(fieldProps.value, "dd.MM.yyyy")
              : fieldProps.value
          }
        />
        <InputGroupAddon addonType="append">
          <Button
            color={invalid ? "danger" : "primary"}
            disabled={disabled || readOnly}
            innerRef={calendarToggleBtn}
            onClick={() => setIsCalendarOpen((isOpen) => !isOpen)}
            outline
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </Button>
        </InputGroupAddon>
      </InputGroup>

      <Popover
        fade={false}
        innerClassName="shadow"
        isOpen={isCalendarOpen}
        modifiers={{ computeStyle: { gpuAcceleration: false } }}
        placement={calendarPlacement}
        target={calendarToggleBtn}
        toggle={onCalendarToggle}
        trigger="focus"
      >
        <Calendar />
      </Popover>
    </>
  );
};

export default InputControl;
