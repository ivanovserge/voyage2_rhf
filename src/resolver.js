import get from "lodash.get";
import set from "lodash.set";
import { format } from "date-fns";

import {
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
  MAX_COUNTRY_COUNT,
  RUSSIA,
  REGEX_VALIDATION,
} from "./constants";

export const resolver = (values, { currentDateTime, stepIndex }) => {
  const errors = {};

  switch (stepIndex) {
    case 0: {
      const travellers = get(values, FORM_PATHS.TRAVELLERS);
      const tripTypeCode = get(values, FORM_PATHS.TRIP_TYPE_CODE);
      const countries = get(values, FORM_PATHS.COUNTRIES);
      const beginDate = get(values, FORM_PATHS.BEGIN_DATE);
      const arrival = get(values, FORM_PATHS.ARRIVAL);
      const isInTrip = get(values, FORM_PATHS.IS_IN_TRIP);

      const minTravellerDob = parseToUTC(getMinTravellerDob(currentDateTime));
      const maxTravellerDob = parseToUTC(getMaxTravellerDob(currentDateTime));
      const minBeginDate = parseToUTC(
        getMinBeginDate(currentDateTime, isInTrip)
      );
      const maxBeginDate = parseToUTC(getMaxBeginDate(currentDateTime));
      const minArrival = parseToUTC(getMinArrival(currentDateTime, beginDate));
      const maxArrival = parseToUTC(getMaxArrival(currentDateTime, beginDate));

      travellers.forEach(({ dob }, idx) => {
        const fieldName = `${FORM_PATHS.TRAVELLERS}.${idx}.dob`;
        if (typeof dob !== "number") {
          set(errors, fieldName, {
            type: "required",
            message: "Не указана дата рождения",
          });
        } else if (dob > maxTravellerDob) {
          set(errors, fieldName, {
            type: "max",
            message: `Дата рождения не может быть позднее ${format(
              maxTravellerDob,
              "dd.MM.yyyy"
            )}`,
          });
        } else if (dob < minTravellerDob) {
          set(errors, fieldName, {
            type: "min",
            message: `Дата рождения не может быть ранее ${format(
              minTravellerDob,
              "dd.MM.yyyy"
            )}`,
          });
        }
      });

      if (!countries.length) {
        set(errors, FORM_PATHS.COUNTRIES, {
          type: "required",
          message: "Не указаны страны пребывания",
        });
      } else if (countries.length > MAX_COUNTRY_COUNT) {
        set(errors, FORM_PATHS.COUNTRIES, {
          type: "maxCount",
          message: `Вы можете указать не более ${MAX_COUNTRY_COUNT} стран или "ВЕСЬ МИР"`,
        });
      } else if (
        countries.length === 1 &&
        countries[0].country.code === RUSSIA &&
        tripTypeCode === "multiple"
      ) {
        set(errors, FORM_PATHS.COUNTRIES, {
          type: "noMultipleTripInRussia",
          message:
            "Многократные поездки только по России недоступны для страхования",
        });
      }

      if (tripTypeCode === "single") {
        if (typeof beginDate !== "number") {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "required",
            message: "Не указана дата вылета",
          });
        } else if (beginDate > maxBeginDate) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "max",
            message: `Дата вылета не может быть позднее ${format(
              maxBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        } else if (beginDate < minBeginDate) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "min",
            message: `Дата вылета не может быть ранее ${format(
              minBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        }

        if (typeof arrival !== "number") {
          set(errors, FORM_PATHS.ARRIVAL, {
            type: "required",
            message: "Не указана дата возвращения",
          });
        } else {
          if (arrival < minArrival) {
            set(errors, FORM_PATHS.ARRIVAL, {
              type: "min",
              message: `Дата возвращения не может быть ранее ${format(
                minArrival,
                "dd.MM.yyyy"
              )}`,
            });
          } else if (arrival > maxArrival) {
            set(errors, FORM_PATHS.ARRIVAL, {
              type: "max",
              message: `Дата возвращения не может быть позднее ${format(
                maxArrival,
                "dd.MM.yyyy"
              )}`,
            });
          }
          if (typeof beginDate === "number" && beginDate > arrival) {
            set(errors, FORM_PATHS.ARRIVAL, {
              type: "laterThanDepartureDate",
              message: "Дата возвращения не может быть ранее даты вылета",
            });
          }
        }
      } else if (tripTypeCode === "multiple") {
        if (typeof beginDate !== "number") {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "required",
            message: "Не указана дата первой поездки",
          });
        } else if (beginDate > maxBeginDate) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "max",
            message: `Дата первой поездки не может быть позднее ${format(
              maxBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        } else if (beginDate < minBeginDate) {
          set(errors, FORM_PATHS.BEGIN_DATE, {
            type: "min",
            message: `Дата первой поездки не может быть ранее ${format(
              minBeginDate,
              "dd.MM.yyyy"
            )}`,
          });
        }
      }
      break;
    }

    case 2: {
      const travellers = get(values, FORM_PATHS.TRAVELLERS);
      const countries = get(values, FORM_PATHS.COUNTRIES);
      const isRussia =
        countries.length === 1 && countries[0].country.code === RUSSIA;
      const regexValidation = REGEX_VALIDATION[isRussia ? "RU_EN" : "EN"];

      travellers.forEach((el, idx) => {
        const mapping = [
          { fieldName: "firstName", required: "Не указано имя" },
          { fieldName: "lastName", required: "Не указана фамилия" },
          { fieldName: "middleName" },
        ];
        mapping.forEach(({ fieldName, required }) => {
          const fullFieldName = `${FORM_PATHS.TRAVELLERS}.${idx}.${fieldName}`;
          const value = el[fieldName];
          if (value) {
            if (!regexValidation.pattern.test(value)) {
              set(errors, fullFieldName, {
                type: "pattern",
                message: regexValidation.message,
              });
            }
          } else if (required) {
            set(errors, fullFieldName, {
              type: "required",
              message: required,
            });
          }
        });
      });
      break;
    }

    case 3: {
      break;
    }

    default:
  }

  return { values, errors };
};
