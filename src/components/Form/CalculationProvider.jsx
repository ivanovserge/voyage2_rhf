import * as React from "react";
import { useWatch } from "react-hook-form";
import { CancelToken, isCancel } from "axios";
import get from "lodash.get";
import set from "lodash.set";
import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";

import { CurrentDateTimeCtx, ProductDataCtx } from "App";
import {
  fetchApi,
  getMaxArrival,
  getMaxBeginDate,
  getMaxTravellerDob,
  getMinArrival,
  getMinBeginDate,
  getMinTravellerDob,
  parseToUTC,
} from "utils";
import {
  FORM_PATHS,
  RUSSIA,
  MAX_TRAVELLER_COUNT,
  MAX_COUNTRY_COUNT,
} from "../../constants";

export const DataCtx = React.createContext();
export const LoadingCtx = React.createContext();
export const ErrorCtx = React.createContext();

const CalculationProvider = ({ children }) => {
  const watch = useWatch();
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const productData = React.useContext(ProductDataCtx);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState();
  const [error, setError] = React.useState();

  const minTravellerDob = React.useMemo(
    () => parseToUTC(getMinTravellerDob(currentDateTime)),
    [currentDateTime]
  );
  const maxTravellerDob = React.useMemo(
    () => parseToUTC(getMaxTravellerDob(currentDateTime)),
    [currentDateTime]
  );
  const maxBeginDate = React.useMemo(
    () => parseToUTC(getMaxBeginDate(currentDateTime)),
    [currentDateTime]
  );

  const fieldNames = React.useMemo(() => {
    const { covers, options } = productData.registers.insConditions;
    const result = [
      FORM_PATHS.COUNTRIES,
      FORM_PATHS.CURRENCY_CODE,
      FORM_PATHS.TRIP_TYPE_CODE,
      FORM_PATHS.COUNTRIES,
      FORM_PATHS.BEGIN_DATE,
      FORM_PATHS.ARRIVAL,
      FORM_PATHS.TRIP_PERIOD,
      FORM_PATHS.SCONTO,
    ];
    for (let i = 0; i < MAX_TRAVELLER_COUNT; i++) {
      result.push(`${FORM_PATHS.TRAVELLERS}.${i}.dob`);
    }
    covers.forEach(({ code }) => {
      result.push(`${FORM_PATHS.COVERS}.${code}.limit`);
      if (code !== "medical") {
        result.push(
          `${FORM_PATHS.COVERS}.${code}.on`,
          `${FORM_PATHS.COVERS}.${code}.program.code`,
          `${FORM_PATHS.COVERS}.${code}.insVariant.code`
        );
      }
    });
    options.forEach(({ code }) => result.push(`${FORM_PATHS.OPTIONS}.${code}`));
    return result;
  }, [productData.registers.insConditions]);

  const prevWatchRef = React.useRef({});
  const didMountRef = React.useRef(true);

  React.useEffect(() => {
    const source = CancelToken.source();

    const isValid = () => {
      const travellers = get(watch, FORM_PATHS.TRAVELLERS);
      const areTravellersValid = travellers.every(
        ({ dob }) =>
          typeof dob === "number" &&
          dob <= maxTravellerDob &&
          dob >= minTravellerDob
      );
      if (!areTravellersValid) {
        return false;
      }

      const tripTypeCode = get(watch, FORM_PATHS.TRIP_TYPE_CODE);
      if (!tripTypeCode) {
        return false;
      }

      const countries = get(watch, FORM_PATHS.COUNTRIES);
      if (!countries.length || countries.length > MAX_COUNTRY_COUNT) {
        return false;
      }
      if (countries.length === 1 && countries[0].country.code === RUSSIA) {
        const tripTypeCode = get(watch, FORM_PATHS.TRIP_TYPE_CODE);
        if (tripTypeCode === "multiple") {
          return false;
        }
      }

      const currency = get(watch, FORM_PATHS.CURRENCY);
      if (!currency) {
        return false;
      }

      const limit = get(watch, FORM_PATHS.LIMIT);
      if (!limit) {
        return false;
      }

      const beginDate = get(watch, FORM_PATHS.BEGIN_DATE);
      const isInTrip = get(watch, FORM_PATHS.IS_IN_TRIP);
      const minBeginDate = parseToUTC(
        getMinBeginDate(currentDateTime, isInTrip)
      );
      if (
        typeof beginDate !== "number" ||
        beginDate < minBeginDate ||
        beginDate > maxBeginDate
      ) {
        return false;
      }

      switch (tripTypeCode) {
        case "single":
          const arrival = get(watch, FORM_PATHS.ARRIVAL);
          const minArrival = parseToUTC(
            getMinArrival(currentDateTime, beginDate)
          );
          const maxArrival = parseToUTC(
            getMaxArrival(currentDateTime, beginDate)
          );
          return (
            typeof arrival === "number" &&
            arrival >= minArrival &&
            arrival <= maxArrival
          );
        case "multiple":
          const tripPeriod = get(watch, FORM_PATHS.TRIP_PERIOD);
          return !!tripPeriod;
        default:
          return false;
      }
    };

    if (!didMountRef.current) {
      if (isValid()) {
        let hasChanged = false;
        for (let i = 0; i < fieldNames.length; i++) {
          const fieldName = fieldNames[i];
          const value = get(watch, fieldName);
          const prevValue = get(prevWatchRef.current, fieldName);
          if (!isEqual(value, prevValue)) {
            hasChanged = true;
            break;
          }
        }

        if (hasChanged) {
          setLoading(true);
          fetchApi(
            "voyage2.calculateB2C",
            "Products\\Calculation",
            watch,
            source.token
          )
            .then((res) => {
              const { data, success, error } = res.data;
              if (!success) {
                throw new Error(error || "Calculation request failed.");
              }
              setData(data);
              setError("");
            })
            .catch((err) => {
              if (!isCancel(err)) {
                const message =
                  (err.response
                    ? err.response.data.error
                    : err.request
                    ? err.request.statusText
                    : err.message) || "Calculation request failed.";
                setError(message);
                console.error(err);
              }
            })
            .finally(() => setLoading(false));
        }
      } else {
        setData(null);
      }

      for (let i = 0; i < fieldNames.length; i++) {
        const fieldName = fieldNames[i];
        const value = get(watch, fieldName);
        set(prevWatchRef.current, fieldName, cloneDeep(value));
      }
    } else {
      didMountRef.current = false;
    }

    return () => source.cancel();
  }, [
    currentDateTime,
    fieldNames,
    maxBeginDate,
    maxTravellerDob,
    minTravellerDob,
    watch,
  ]);

  return (
    <DataCtx.Provider value={data}>
      <LoadingCtx.Provider value={loading}>
        <ErrorCtx.Provider value={error}>{children}</ErrorCtx.Provider>
      </LoadingCtx.Provider>
    </DataCtx.Provider>
  );
};

export default CalculationProvider;
