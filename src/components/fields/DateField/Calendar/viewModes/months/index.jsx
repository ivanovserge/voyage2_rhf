import { Button } from "reactstrap";
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  getTime,
  isEqual,
  startOfMonth,
  startOfYear,
} from "date-fns";

import Header from "./Header";
import { useDateField } from "../../../";

const ViewMonths = () => {
  const { maxDate, minDate, month, setMonth, setViewMode } = useDateField();

  const months = eachMonthOfInterval({
    start: startOfYear(month),
    end: endOfYear(month),
  });
  const rows = months.reduce((acc, currVal) => {
    const lastRow = acc[acc.length - 1] || [];
    lastRow.length && lastRow.length < 4
      ? acc[acc.length - 1].push(currVal)
      : acc.push([currVal]);
    return acc;
  }, []);

  return (
    <>
      <Header />
      {rows.map((row) => (
        <div key={getTime(row[0])} className="d-inline-flex w-100">
          {row.map((date) => {
            const disabled =
              date < startOfMonth(minDate) || date > startOfMonth(maxDate);
            const selected = isEqual(date, startOfMonth(month));
            const onClick = () => {
              if (disabled) {
                return;
              }
              setMonth(startOfMonth(date));
              setViewMode("days");
            };
            const monthDisplay = format(date, "LLL").substr(0, 3);

            return (
              <Button
                key={getTime(date)}
                className="w-100"
                color={selected ? "primary" : "link"}
                disabled={disabled}
                onClick={onClick}
                outline={!selected}
                size="sm"
              >
                {monthDisplay}
              </Button>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default ViewMonths;
