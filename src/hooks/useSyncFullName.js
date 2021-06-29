import * as React from "react";
import { useFormContext } from "react-hook-form";
import get from "lodash.get";

const useSyncFullName = (path) => {
  const { getValues, setValue } = useFormContext();

  return React.useCallback(() => {
    const formValues = getValues();
    const { firstName, lastName, middleName } = get(formValues, path);
    const fullName = `${lastName} ${firstName} ${middleName}`.trim();

    setValue(`${path}.name`, fullName);
  }, [getValues, path, setValue]);
};

export default useSyncFullName;
