import * as React from "react";
import { useController } from "react-hook-form";
import { getYear, startOfDay } from "date-fns";

import InputControl from "./InputControl";
import ErrorTooltip from "../ErrorTooltip";
import { getFieldDate } from "./utils";
import { useUniqueId } from "hooks";

const DateFieldCtx = React.createContext();
export const useDateField = () => React.useContext(DateFieldCtx);

const DateField = ({
  calendarPlacement,
  className,
  defaultDate,
  disabled,
  inputProps,
  maxDate,
  minDate,
  parse,
  placeholder,
  prepend,
  readOnly,
  ...useControllerProps
}) => {
  const {
    field: { ref, ...fieldProps },
    fieldState: { error },
  } = useController(useControllerProps);

  const [date, setDate] = React.useState(() =>
    getFieldDate(fieldProps.value, defaultDate)
  );
  const [month, setMonth] = React.useState(date);
  const [year, setYear] = React.useState(() => getYear(month));
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("days");

  const didMountRef1 = React.useRef(true);
  React.useEffect(() => {
    if (!didMountRef1.current) {
      setDate(getFieldDate(fieldProps.value, defaultDate));
    } else {
      didMountRef1.current = false;
    }
  }, [defaultDate, fieldProps.value]);

  const didMountRef2 = React.useRef(true);
  React.useEffect(() => {
    if (!didMountRef2.current) {
      setMonth(date);
    } else {
      didMountRef2.current = false;
    }
  }, [date]);

  const didMountRef3 = React.useRef(true);
  React.useEffect(() => {
    if (!didMountRef3.current) {
      setYear(getYear(month));
    } else {
      didMountRef3.current = false;
    }
  }, [month]);

  const id = useUniqueId();

  return (
    <ErrorTooltip
      ref={ref}
      className={className}
      hidden={isCalendarOpen}
      message={error?.message}
      tabIndex={-1}
      target={id}
    >
      <DateFieldCtx.Provider
        value={{
          calendarPlacement,
          date,
          fieldProps,
          isCalendarOpen,
          maxDate,
          minDate,
          month,
          parse,
          readOnly,
          setDate,
          setIsCalendarOpen,
          setMonth,
          setViewMode,
          setYear,
          viewMode,
          year,
        }}
      >
        <InputControl
          disabled={disabled}
          inputProps={{ ...inputProps, id }}
          invalid={!!error}
          placeholder={placeholder}
          prepend={prepend}
          readOnly={readOnly}
        />
      </DateFieldCtx.Provider>
    </ErrorTooltip>
  );
};

DateField.defaultProps = {
  calendarPlacement: "bottom",
  defaultDate: startOfDay(new Date()),
  placeholder: "дд.мм.гггг",
};

export default DateField;
