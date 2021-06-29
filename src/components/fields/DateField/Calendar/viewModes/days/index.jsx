import { Button } from "reactstrap";
import cn from "classnames";
import {
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  getDate,
  getTime,
  isAfter,
  isBefore,
  isEqual,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import Header from "./Header";
import { useDateField } from "../../../";

const ViewDays = () => {
  const {
    date,
    fieldProps,
    maxDate,
    minDate,
    month,
    setIsCalendarOpen,
    parse,
  } = useDateField();

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(month, { weekStartsOn: 1 }),
    end: endOfWeek(month, { weekStartsOn: 1 }),
  });
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const weeks = eachWeekOfInterval(
    {
      start: monthStart,
      end: monthEnd,
    },
    { weekStartsOn: 1 }
  );
  const weekRows = weeks.map((weekStart) =>
    eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart, { weekStartsOn: 1 }),
    })
  );

  return (
    <>
      <Header />
      <div className="d-inline-flex w-100">
        {daysOfWeek.map((day) => (
          <div key={getDate(day)} className="w-100 small text-center">
            {format(day, "EEEEEE")}
          </div>
        ))}
      </div>
      {weekRows.map((week) => (
        <div key={getTime(week[0])} className="d-inline-flex w-100">
          {week.map((day) => {
            const disabled = isBefore(day, minDate) || isAfter(day, maxDate);
            const selected = isEqual(day, date);
            const isCurrentMonth =
              !isBefore(day, monthStart) && !isAfter(day, monthEnd);
            const onClick = () => {
              if (disabled) {
                return;
              }
              const time = getTime(day);
              const updatedValue =
                typeof parse === "function" ? parse(time) : time;
              fieldProps.onChange(updatedValue);
              setIsCalendarOpen(false);
            };
            const dayDisplay = format(day, "dd");

            return (
              <Button
                key={getDate(day)}
                className={cn("w-100", !isCurrentMonth && "invisible")}
                color={selected ? "primary" : "link"}
                disabled={disabled}
                onClick={onClick}
                outline={!selected}
                size="sm"
              >
                {dayDisplay}
              </Button>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default ViewDays;
