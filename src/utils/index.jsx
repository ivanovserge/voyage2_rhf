import {
  addDays,
  addMinutes,
  addYears,
  endOfDay,
  getTime,
  isValid,
  startOfDay,
  subDays,
  subYears,
  toDate,
} from "date-fns";
import axios from "axios";

import config from "../config";
import {
  CURRENCY_OPTION_USD,
  CURRENCY_OPTION_EUR,
  CURRENCY_OPTION_RUR,
  VARIATIVE_LIMITS_UE,
  HARDCODED_LIMITS_UE,
  MIN_LIMIT,
  MAX_TRAVELLER_AGE,
  RUSSIA,
  SCHENGEN,
  WORLDWIDE,
  USA,
} from "../constants";

export const isMedicalOn = (insConditions) =>
  insConditions.covers?.some(({ code }) => code === "medical");

export const getNoun = (number, case1, case2, case3) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return case3;
  }
  n %= 10;
  if (n === 1) {
    return case1;
  }
  if (n >= 2 && n <= 4) {
    return case2;
  }
  return case3;
};

export const formatCountry = (value) => value.map(({ country }) => country);

export const parseCountry = (value) => value.map((country) => ({ country }));

export const processCountries = (value) => {
  if (!value.length) {
    return value;
  }
  const lastItem = value[value.length - 1];
  return lastItem.code === WORLDWIDE
    ? [lastItem]
    : value.filter(({ code }) => code !== WORLDWIDE);
};

export const getProgramsByCurrencyCode = (programs, currencyCode) =>
  currencyCode === "RUR"
    ? programs.filter(({ currency }) => currency === "RUR")
    : programs.filter(({ currency }) => currency !== "RUR");

export const getCurrencyOptions = (countries) => {
  const result = [];

  let hasUsd;
  const isEuroZone = countries.some((item) => item.country.euroZone);
  if (isEuroZone) {
    hasUsd = false;
  } else {
    const isSchengen = countries.some(
      ({ country: { isSchengen, code } }) => isSchengen || code === SCHENGEN
    );
    if (isSchengen) {
      hasUsd = false;
    } else {
      hasUsd = countries.some((item) => item.country.currensies.USD);
    }
  }

  const hasEur = countries.some((item) => item.country.currensies.EUR);

  const hasRur =
    countries.length === 1 &&
    countries.some(
      ({ country: { currensies, code } }) => currensies.RUR && code === RUSSIA
    );

  hasUsd && result.push(CURRENCY_OPTION_USD);
  hasEur && result.push(CURRENCY_OPTION_EUR);
  hasRur && result.push(CURRENCY_OPTION_RUR);

  return result;
};

export const getLimitOptions = (covers, curRates, countries, currencyCode) => {
  const result = [];

  const rate = curRates.find(({ valute }) => valute === currencyCode);
  const minLimit = Math.max(...countries.map((el) => el.country.data.minSS));
  const medicalCover = covers.find(({ code }) => code === "medical");
  const isRur = currencyCode === "RUR";
  const variativeLimits = isRur
    ? []
    : VARIATIVE_LIMITS_UE.filter((el) => ~medicalCover.limits.indexOf(el));
  const hardcodedLimits = isRur
    ? medicalCover.limitsRUR
    : HARDCODED_LIMITS_UE.filter((el) => ~medicalCover.limits.indexOf(el));

  for (let i = 0; i < variativeLimits.length; i++) {
    const limit = variativeLimits[i];
    if (limit >= minLimit && (!rate || rate.value * limit >= MIN_LIMIT)) {
      result.push({ code: limit, name: limit });
      break;
    }
  }

  for (let i = 0; i < hardcodedLimits.length; i++) {
    const limit = hardcodedLimits[i];
    if (limit >= minLimit) {
      result.push({ code: limit, name: limit });
    }
  }

  return result;
};

export const parseToUTC = (value) => {
  if (!isValid(value)) {
    return value;
  }
  const date = toDate(value);
  return getTime(addMinutes(date, -date.getTimezoneOffset()));
};

export const getMinTravellerDob = (currentDateTime) =>
  startOfDay(addDays(subYears(currentDateTime, MAX_TRAVELLER_AGE - 1), 1));

export const getMaxTravellerDob = (currentDateTime) =>
  startOfDay(currentDateTime);

export const getMinBeginDate = (currentDateTime, isInTrip) =>
  startOfDay(addDays(currentDateTime, isInTrip ? 5 : 1));

export const getMaxBeginDate = (currentDateTime) =>
  endOfDay(addDays(currentDateTime, 180));

export const getMinArrival = (currentDateTime, beginDate) =>
  startOfDay(
    typeof beginDate === "number" ? beginDate : addDays(currentDateTime, 1)
  );

export const getMaxArrival = (currentDateTime, beginDate) =>
  endOfDay(
    typeof beginDate === "number"
      ? subDays(addYears(beginDate, 1), 1)
      : addYears(currentDateTime, 1)
  );

export const getActiveCoverCodes = (covers) =>
  Object.entries(covers)
    .filter(([_, value]) => value?.on)
    .map(([code]) => code);

export const getOptionsToShow = (insConditions, covers) => {
  const activeCoverCodes = getActiveCoverCodes(covers);

  return insConditions.options.reduce((acc, currVal) => {
    Object.entries(currVal.covers).forEach(([key, value]) => {
      if (!value) {
        return;
      }
      const isActive = activeCoverCodes.includes(key);
      if (!isActive) {
        return;
      }
      const isInArr = acc.some(({ code }) => code === currVal.code);
      if (!isInArr) {
        acc.push(currVal);
      }
    });
    return acc;
  }, []);
};

export const isOptionEnabled = (code, insConditions, covers) =>
  getOptionsToShow(insConditions, covers).some((el) => el.code === code);

export const getNeededToResetOptionCodes = (
  coverCode,
  insConditions,
  covers
) => {
  const options = insConditions.options.filter((el) => el.covers[coverCode]);
  const activeCoverCodes = getActiveCoverCodes(covers);
  const coverCodes = activeCoverCodes.filter((el) => el !== coverCode);
  const result = [];

  options.forEach(({ code, covers }) => {
    const linkedCoverCodes = [];
    for (const key in covers) {
      if (covers[key]) {
        linkedCoverCodes.push(key);
      }
    }
    if (linkedCoverCodes.every((el) => !~coverCodes.indexOf(el))) {
      result.push(code);
    }
  });

  return result;
};

export const getPremiumByProgram = (calcData, programCode) => {
  const calculateResultItemByProgram = calcData.find(
    (el) => el.program.code === programCode
  );
  return calculateResultItemByProgram.logic.results.data.premiumRUR;
};

export const isWorldwideOrUSA = (countries) =>
  countries.some(({ country: { code } }) => code === WORLDWIDE || code === USA);

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.substring(1);

export const capitalizeName = (str) =>
  str.replace(/(?:^|\s|-|["'([{])+\S/g, (match) => match.toUpperCase());

export const getFormattedSum = (sum, options) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
    ...options,
    currency: options.currency === "RUR" ? "RUB" : options.currency,
  }).format(parseFloat(sum));

export const fetchApi = (operation, ns, data, cancelToken) =>
  axios({
    url: config.api,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams({
      operation,
      ns,
      data: JSON.stringify(data),
    }).toString(),
    withCredentials: true,
    cancelToken,
  });
