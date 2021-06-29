import * as React from "react";
import { useFormContext } from "react-hook-form";
import get from "lodash.get";

import Cover from "./Cover";
import { ProductDataCtx } from "App";
import { FORM_PATHS, WORLDWIDE, USA } from "../../../constants";

const Covers = () => {
  const { getValues } = useFormContext();
  const productData = React.useContext(ProductDataCtx);

  const values = getValues();
  const tripTypeCode = get(values, FORM_PATHS.TRIP_TYPE_CODE);
  const countries = get(values, FORM_PATHS.COUNTRIES);
  const isInTrip = get(values, FORM_PATHS.IS_IN_TRIP);

  if (isInTrip) {
    return null;
  }

  const isWorldwideOrUSA = countries.some(
    ({ country: { code } }) => code === WORLDWIDE || code === USA
  );
  const list = productData.registers.insConditions.covers.filter(
    ({ code }) =>
      code !== "medical" &&
      // Для многократных поездок покрытие "Отмена поездки" не нужно
      !(tripTypeCode === "multiple" && code === "tripCancel")
  );

  return list.map((el) => (
    <React.Fragment key={el.code}>
      <Cover cover={el} isWorldwideOrUSA={isWorldwideOrUSA} />
      <hr />
    </React.Fragment>
  ));
};

export default Covers;
