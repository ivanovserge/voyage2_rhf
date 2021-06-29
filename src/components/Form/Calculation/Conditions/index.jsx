import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { differenceInDays } from "date-fns";
import get from "lodash.get";

import TripType from "./TripType";
import Countries from "./Countries";
import Currency from "./Currency";
import Limit from "./Limit";
import IsInTrip from "./IsInTrip";
import Dates from "./Dates";
import TripLengthInfo from "./TripLengthInfo";
import TripPeriod from "./TripPeriod";
import Sport from "./Sport";
import ProgramsTable from "./ProgramsTable";
import { CurrentDateTimeCtx, ProductDataCtx } from "App";
import {
  getActiveCoverCodes,
  getCurrencyOptions,
  getLimitOptions,
  getMaxArrival,
  getMaxBeginDate,
  getMinArrival,
  getMinBeginDate,
  getNeededToResetOptionCodes,
  getProgramsByCurrencyCode,
  isWorldwideOrUSA,
} from "utils";
import { FORM_PATHS, RUSSIA, SNG } from "../../../../constants";

const Conditions = () => {
  const { getValues, setValue } = useFormContext();
  const { isValid, errors } = useFormState();
  const [
    travellers,
    tripTypeCode,
    countries,
    currencyCode,
    limit,
    tripLength,
    tripPeriod,
  ] = useWatch({
    name: [
      FORM_PATHS.TRAVELLERS,
      FORM_PATHS.TRIP_TYPE_CODE,
      FORM_PATHS.COUNTRIES,
      FORM_PATHS.CURRENCY_CODE,
      FORM_PATHS.LIMIT,
      FORM_PATHS.TRIP_LENGTH,
      FORM_PATHS.TRIP_PERIOD,
    ],
  });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const productData = React.useContext(ProductDataCtx);

  const { insConditions, curRates } = productData.registers;

  const isRussiaSelected = countries.some((el) => el.country.code === RUSSIA);

  function updateProgram() {
    const newCurrencyCode = arguments[0];
    if (newCurrencyCode === currencyCode) {
      return;
    }

    const { programs: medicalPrograms } = insConditions.covers.find(
      ({ code }) => code === "medical"
    );
    const programs = getProgramsByCurrencyCode(
      medicalPrograms,
      newCurrencyCode
    );
    const updatedProgram = programs[0];
    setValue(FORM_PATHS.PROGRAM, updatedProgram);

    // При обновлении программы, если валюта изменилась с рублей на нерубли или наоборот, необходимо сбросить покрытия.
    if (newCurrencyCode === "RUR" || currencyCode === "RUR") {
      const covers = get(getValues(), FORM_PATHS.COVERS);
      Object.entries(covers).forEach(([code]) => {
        if (code !== "medical") {
          if (code === "estate") {
            setValue(FORM_PATHS.COVER_ESTATE_INS_VARIANT, null);
            setValue(FORM_PATHS.COVER_ESTATE_ON, false);
          } else {
            setValue(`${FORM_PATHS.COVERS}.${code}`, null);
          }
        }
      });
    }
  }

  const updateLimit = (currencyCode) => {
    const formValues = getValues();
    const limitCode = get(formValues, FORM_PATHS.LIMIT_CODE);

    if (limitCode) {
      const countries = get(formValues, FORM_PATHS.COUNTRIES);
      const options = getLimitOptions(
        insConditions.covers,
        curRates,
        countries,
        currencyCode
      );
      const hasSelectedLimit = options.some(({ code }) => code === limitCode);
      // Если в обновлённом списке СС нет СС, которая выбрана на текущий момент,
      if (!hasSelectedLimit) {
        // сбросим СС.
        setValue(FORM_PATHS.LIMIT, null);
      }
    }
  };

  const updateTripLength = () => {
    const formValues = getValues();
    const tripTypeCode = get(formValues, FORM_PATHS.TRIP_TYPE_CODE);
    const isInTrip = get(formValues, FORM_PATHS.IS_IN_TRIP);
    const beginDate = get(formValues, FORM_PATHS.BEGIN_DATE);
    const arrival = get(formValues, FORM_PATHS.ARRIVAL);

    if (
      tripTypeCode === "multiple" ||
      typeof beginDate !== "number" ||
      typeof arrival !== "number"
    ) {
      return setValue(FORM_PATHS.TRIP_LENGTH, undefined);
    }

    const minBeginDate = getMinBeginDate(currentDateTime, isInTrip);
    const maxBeginDate = getMaxBeginDate(currentDateTime);
    const isBeginDateValid =
      beginDate >= minBeginDate && beginDate <= maxBeginDate;
    if (!isBeginDateValid) {
      return setValue(FORM_PATHS.TRIP_LENGTH, undefined);
    }

    const minArrival = getMinArrival(currentDateTime, beginDate);
    const maxArrival = getMaxArrival(currentDateTime, beginDate);
    const isArrivalValid = arrival >= minArrival && arrival <= maxArrival;
    setValue(
      FORM_PATHS.TRIP_LENGTH,
      isArrivalValid ? differenceInDays(arrival, beginDate) + 1 : undefined
    );
  };

  function updateCovers() {
    const formValues = getValues();
    const newCurrencyCode = arguments[0] || currencyCode;
    const isInTrip = get(formValues, FORM_PATHS.IS_IN_TRIP);

    if (isInTrip) {
      return;
    }

    const tripTypeCode = get(formValues, FORM_PATHS.TRIP_TYPE_CODE);
    const countries = get(formValues, FORM_PATHS.COUNTRIES);
    const isWorldwideOrUSASelected = isWorldwideOrUSA(countries);

    insConditions.covers.forEach(
      ({ code, limits, limitsRUR, limitType, programs }) => {
        if (
          code !== "medical" &&
          // Для многократных поездок "Отмена поездки" не страхуется.
          !(tripTypeCode === "multiple" && code === "tripCancel")
        ) {
          const formCover = get(formValues, `${FORM_PATHS.COVERS}.${code}`);
          const program = formCover?.program;
          const isLimitManual = limitType.code === "manual";
          const limitPath = isLimitManual ? "limit" : "limit.code";
          const limit = formCover?.[limitPath];
          let updatedProgram = program;

          if (
            !program ||
            (program?.data.nonWorldAndUSA && isWorldwideOrUSASelected)
          ) {
            const possiblePrograms = getProgramsByCurrencyCode(
              programs,
              newCurrencyCode
            ).filter(
              ({ data }) =>
                !isWorldwideOrUSASelected ||
                (isWorldwideOrUSASelected && !data.nonWorldAndUSA)
            );

            if (possiblePrograms.length) {
              updatedProgram = possiblePrograms[0];
            }
          }

          if (
            updatedProgram &&
            code !== "estate" &&
            updatedProgram.code !== "O4" &&
            updatedProgram.code !== "O4RUR" &&
            updatedProgram.code !== program?.code
          ) {
            setValue(`${FORM_PATHS.COVERS}.${code}.program`, updatedProgram);
          }

          const maxLimit = updatedProgram?.maxLimit || 0;
          const limitsArr = newCurrencyCode === "RUR" ? limitsRUR : limits;

          if (code === "estate") {
            const insVariant = formCover?.insVariant;
            const limitOptions = limitsArr.reduce((acc, currVal) => {
              if (currVal.type !== "flat") {
                return acc;
              }
              if (!maxLimit || currVal.limit <= maxLimit) {
                acc.push(currVal);
              }
              return acc;
            }, []);

            if (
              !insVariant ||
              !limitOptions.some(({ code }) => code === insVariant.code)
            ) {
              setValue(
                `${FORM_PATHS.COVERS}.${code}.insVariant`,
                limitOptions[0]
              );
            }
          } else if (!limit || (!!maxLimit && limit > maxLimit)) {
            let updatedLimit = 0;

            if (isLimitManual) {
              updatedLimit = maxLimit;
            } else {
              const possibleLimits = limitsArr.filter(
                (el) => !maxLimit || el <= maxLimit
              );
              if (possibleLimits.length) {
                updatedLimit = {
                  code: possibleLimits[0],
                  name: possibleLimits[0],
                };
              }
            }

            setValue(`${FORM_PATHS.COVERS}.${code}.limit`, updatedLimit);
          }
        }
      }
    );
  }

  const onTripTypeChange = (value) => {
    if (value.code === "multiple") {
      // Для многократных поездок "Отмена поездки" не страхуется.
      setValue(FORM_PATHS.COVER_TRIP_CANCEL_ON, false);

      const covers = get(getValues(), FORM_PATHS.COVERS);
      const optionToResetCodes = getNeededToResetOptionCodes(
        "tripCancel",
        insConditions,
        covers
      );
      optionToResetCodes.forEach((el) =>
        setValue(`${FORM_PATHS.OPTIONS}.${el}`, false)
      );
    }

    updateCovers();
    updateTripLength();
  };

  const onCountriesChange = (value) => {
    // Актуализируем список стран.
    const countriesStr = value.map((el) => el.country.name).join(", ");
    setValue(FORM_PATHS.COUNTRY_LIST, countriesStr);

    if (!value.length) {
      return;
    }

    const formValues = getValues();

    // Актуализируем валюту, если выбрана хотя бы одна страна. Если поле стран пусто, нужно сохранить текущие значения валюты, программы и СС.
    const currencyOptions = getCurrencyOptions(value);
    const currencyCode = get(formValues, FORM_PATHS.CURRENCY_CODE);
    const hasSelectedCurrency = currencyOptions.some(
      ({ code }) => code === currencyCode
    );

    let newCurrency = null,
      newCurrencyCode = currencyCode;

    // Если в обновлённом списке валют нет валюты, которая выбрана на текущий момент,
    if (!hasSelectedCurrency) {
      // и в обновлённом списке валют всего одна валюта,
      if (currencyOptions.length === 1) {
        // установим её.
        newCurrency = currencyOptions[0];
      }

      // В противном случае поле валюты сбросится.
      setValue(FORM_PATHS.CURRENCY, newCurrency);

      newCurrencyCode = newCurrency?.code;
      updateProgram(newCurrencyCode);
    }

    updateLimit(newCurrencyCode);

    const tripCancelProgram = get(
      formValues,
      FORM_PATHS.COVER_TRIP_CANCEL_PROGRAM
    );
    if (isWorldwideOrUSA(value) && tripCancelProgram?.data.nonWorldAndUSA) {
      const covers = get(formValues, FORM_PATHS.COVERS);
      const optionToResetCodes = getNeededToResetOptionCodes(
        "tripCancel",
        insConditions,
        covers
      );

      optionToResetCodes.forEach((el) =>
        setValue(`${FORM_PATHS.OPTIONS}.${el}`, false)
      );
      setValue(FORM_PATHS.COVER_TRIP_CANCEL, null);
    }

    updateCovers(newCurrencyCode);
  };

  const onCurrencyChange = (value) => {
    const newCurrencyCode = value.code;

    updateProgram(newCurrencyCode);
    updateLimit(newCurrencyCode);
    updateCovers(newCurrencyCode);
  };

  const onIsInTripChange = (value) => {
    const formValues = getValues();

    if (value) {
      const covers = get(formValues, FORM_PATHS.COVERS);
      const activeCoverCodes = getActiveCoverCodes(covers);
      const optionToResetCodes = [];
      activeCoverCodes.forEach((el) => {
        if (el !== "medical") {
          optionToResetCodes.concat(
            getNeededToResetOptionCodes(el, insConditions, covers)
          );
          setValue(`${FORM_PATHS.COVERS}.${el}.on`, false);
          if (el === "tripCancel") {
            setValue(FORM_PATHS.COVER_TRIP_CANCEL_PROGRAM, null);
          }
        }
      });
      optionToResetCodes
        .filter((el, idx, arr) => arr.indexOf(el) === idx)
        .forEach((el) => setValue(`${FORM_PATHS.OPTIONS}.${el}`, null));
    }

    updateCovers(currencyCode);
    updateTripLength();
  };

  // Текущий блок показываем, если даты рождения всех путешественников заполнены и заполненные поля выбора дат валидны.
  for (let i = 0; i < travellers.length; i++) {
    if (
      !travellers[i].dob ||
      get(errors, `${FORM_PATHS.TRAVELLERS}.${i}.dob`)
    ) {
      return null;
    }
  }

  const currencyOptions = getCurrencyOptions(countries);
  const limitOptions = getLimitOptions(
    insConditions.covers,
    curRates,
    countries,
    currencyCode
  );

  // Блок выбора валюты показываем, если тип поездки и страны выбраны.
  const showCurrency = !!tripTypeCode && !!countries.length;

  // Блок выбора СС показываем, если условие выше выполнено и есть доступные валюты.
  const showLimit = showCurrency && !!currencyOptions.length;

  // Блок с датами показываем, если условие выше выполнено и валюта и СС выбраны.
  const showDates = showLimit && !!currencyCode && !!limit;

  // Блоки защиты при активном отдыхе и выбора программы показываем, если выполнены следующие условия:
  // 1) условие выше выполнено
  // 2) поездка однократная либо поездка многократная и при этом количество застрахованных дней в году выбрано
  // 3) на текущем шаге нет ошибок валидации
  const showSportAndProgramsTable =
    showDates &&
    (tripTypeCode === "single" ||
      (tripTypeCode === "multiple" && !!tripPeriod)) &&
    isValid;

  // Чекбокс "Уже в поздке" показываем, если среди выбранных стран нет России.
  const showIsInTrip = !isRussiaSelected;

  // Блок количества дней в поездке показываем, если количество дней поездки является числом и среди выбранных стран есть какие-либо кроме России и стран СНГ.
  const showTripLength =
    !!tripLength &&
    countries.some(
      (el) => el.country.code !== RUSSIA && el.country.region?.code !== SNG
    );

  const showTripPeriod = tripTypeCode === "multiple";

  return (
    <>
      <TripType onChange={onTripTypeChange} />
      <Countries onChange={onCountriesChange} />
      {showCurrency && (
        <Currency onChange={onCurrencyChange} options={currencyOptions} />
      )}
      {showLimit && <Limit options={limitOptions} />}
      {showDates && (
        <>
          {showIsInTrip && <IsInTrip onChange={onIsInTripChange} />}
          <Row className="mt-3">
            <Col md={4} xs={12}>
              <Dates onChange={updateTripLength} />
            </Col>
            {showTripLength && (
              <Col md={8} xs={12}>
                <TripLengthInfo />
              </Col>
            )}
          </Row>
          {showTripPeriod && <TripPeriod />}
        </>
      )}
      {showSportAndProgramsTable && (
        <>
          <Sport />
          <ProgramsTable />
        </>
      )}
    </>
  );
};

export default Conditions;
