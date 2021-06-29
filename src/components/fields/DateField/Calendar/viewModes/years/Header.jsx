import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import { getYear } from "date-fns";

import { useDateField } from "../../../";
import { YEAR_COUNT } from "./constants";
import { headerInterval } from "./Header.module.scss";

const Header = () => {
  const { maxDate, minDate, setYear, year } = useDateField();

  const firstYear = year - YEAR_COUNT + 1;
  const prevBtnDisabled = firstYear - 1 < getYear(minDate);
  const nextBtnDisabled = year + 1 > getYear(maxDate);

  return (
    <div className="d-flex justify-content-between align-items-center border-bottom">
      <Button
        className={cn(prevBtnDisabled && "invisible")}
        color="link"
        disabled={prevBtnDisabled}
        onClick={() => setYear(firstYear - 1)}
        outline
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Button>
      <div className={headerInterval}>
        {firstYear} – {year}
      </div>
      <Button
        className={cn(nextBtnDisabled && "invisible")}
        color="link"
        disabled={nextBtnDisabled}
        onClick={() => setYear((year) => year + YEAR_COUNT)}
        outline
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </div>
  );
};

export default Header;
