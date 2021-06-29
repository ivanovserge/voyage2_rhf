import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

const useFullName = (path) => {
  const { setValue } = useFormContext();
  const [lastName, firstName, middleName] = useWatch({
    name: [`${path}.lastName`, `${path}.firstName`, `${path}.middleName`],
  });

  const fullName = `${lastName} ${firstName} ${middleName}`.trim();

  React.useEffect(() => {
    setValue(`${path}.name`, fullName);
  }, [fullName, path, setValue]);

  return fullName;
};

export default useFullName;
