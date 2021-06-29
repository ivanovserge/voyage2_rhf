import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlaneArrival,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { useFormState, useWatch } from "react-hook-form";
import { addDays, startOfDay } from "date-fns";
import get from "lodash.get";

import { DateField } from "components/fields";
import { CurrentDateTimeCtx } from "App";
import {
  getMaxArrival,
  getMaxBeginDate,
  getMinArrival,
  getMinBeginDate,
  parseToUTC,
} from "utils";
import { FORM_PATHS, DATES_TITLE } from "../../../../constants";

const Dates = ({ onChange }) => {
  const { touchedFields } = useFormState();
  const [tripTypeCode, isInTrip, beginDate, arrival] = useWatch({
    name: [
      FORM_PATHS.TRIP_TYPE_CODE,
      FORM_PATHS.IS_IN_TRIP,
      FORM_PATHS.BEGIN_DATE,
      FORM_PATHS.ARRIVAL,
    ],
  });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);

  const minBeginDate = getMinBeginDate(currentDateTime, isInTrip);
  const maxBeginDate = getMaxBeginDate(currentDateTime);
  const minArrival = getMinArrival(currentDateTime, beginDate);
  const maxArrival = getMaxArrival(currentDateTime, beginDate);
  const defaultDate = startOfDay(addDays(currentDateTime, 1));

  const beginDateRules = { onChange };
  if (arrival || get(touchedFields, FORM_PATHS.ARRIVAL)) {
    beginDateRules.deps = FORM_PATHS.ARRIVAL;
  }

  return (
    <>
      <div className="mb-2">{DATES_TITLE[tripTypeCode]}</div>
      <div className="d-flex">
        <div className="mr-2 btn text-primary border border-primary">
          <FontAwesomeIcon icon={faPlaneDeparture} size="1x" />
        </div>
        <DateField
          name={FORM_PATHS.BEGIN_DATE}
          rules={beginDateRules}
          className="w-100"
          defaultDate={defaultDate}
          maxDate={maxBeginDate}
          minDate={minBeginDate}
          parse={parseToUTC}
        />
      </div>
      {tripTypeCode === "single" && (
        <div className="d-flex mt-1">
          <div className="mr-2 btn text-primary border border-primary">
            <FontAwesomeIcon icon={faPlaneArrival} size="1x" />
          </div>
          <DateField
            name={FORM_PATHS.ARRIVAL}
            rules={{ onChange }}
            className="w-100"
            defaultDate={defaultDate}
            disabled={typeof beginDate !== "number"}
            maxDate={maxArrival}
            minDate={minArrival}
            parse={parseToUTC}
          />
        </div>
      )}
    </>
  );
};

export default Dates;
