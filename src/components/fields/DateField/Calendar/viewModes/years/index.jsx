import { Button } from "reactstrap";
import { getYear, setYear } from "date-fns";

import Header from "./Header";
import { useDateField } from "../../../";
import { YEARS_PER_ROW, YEAR_COUNT } from "./constants";

const ViewYears = () => {
  const { maxDate, minDate, month, setMonth, setViewMode, year } =
    useDateField();

  const firstYear = year - YEAR_COUNT + 1;
  const interval = year - firstYear + 1;

  const years = Array.from(Array(interval).keys()).map((el) => el + firstYear);
  const rows = years.reduce((acc, currVal) => {
    const lastRow = acc[acc.length - 1] || [];
    lastRow.length && lastRow.length < YEARS_PER_ROW
      ? acc[acc.length - 1].push(currVal)
      : acc.push([currVal]);
    return acc;
  }, []);

  return (
    <>
      <Header />
      {rows.map((row) => (
        <div key={row[0]} className="d-inline-flex w-100">
          {row.map((year) => {
            const disabled = year < getYear(minDate) || year > getYear(maxDate);
            const selected = year === getYear(month);
            const onClick = () => {
              if (disabled) {
                return;
              }
              setMonth((month) => setYear(month, year));
              setViewMode("months");
            };

            return (
              <Button
                key={year}
                className="w-100"
                color={selected ? "primary" : "link"}
                disabled={disabled}
                onClick={onClick}
                outline={!selected}
                size="sm"
              >
                {year}
              </Button>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default ViewYears;
