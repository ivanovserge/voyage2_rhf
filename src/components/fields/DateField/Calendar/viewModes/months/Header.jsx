import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import {
  addYears,
  endOfYear,
  getYear,
  isAfter,
  isBefore,
  startOfYear,
  subYears,
} from "date-fns";

import { useDateField } from "../../../";

const Header = () => {
  const { maxDate, minDate, month, setMonth, setViewMode } = useDateField();

  const prevBtnDisabled = isBefore(endOfYear(subYears(month, 1)), minDate);
  const nextBtnDisabled = isAfter(startOfYear(addYears(month, 1)), maxDate);
  const yearDisplay = getYear(month);

  return (
    <div className="d-flex justify-content-between align-items-center border-bottom">
      <Button
        className={cn(prevBtnDisabled && "invisible")}
        color="link"
        disabled={prevBtnDisabled}
        onClick={() => setMonth((month) => subYears(month, 1))}
        outline
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Button>
      <Button
        className="text-capitalize"
        color="link"
        onClick={() => setViewMode("years")}
        outline
      >
        {yearDisplay}
      </Button>
      <Button
        className={cn(nextBtnDisabled && "invisible")}
        color="link"
        disabled={nextBtnDisabled}
        onClick={() => setMonth((month) => addYears(month, 1))}
        outline
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </div>
  );
};

export default Header;
