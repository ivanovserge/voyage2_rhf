import { getTime, startOfDay } from "date-fns";

export const getFieldDate = (fieldValue, defaultDate) =>
  getTime(
    startOfDay(typeof fieldValue === "number" ? fieldValue : defaultDate)
  );
