import * as React from "react";
import { useWatch } from "react-hook-form";

import { CheckboxField } from "components/fields";
import { ProductDataCtx } from "App";
import { getOptionsToShow } from "utils";
import { FORM_PATHS } from "../../../constants";

const Options = () => {
  const covers = useWatch({ name: FORM_PATHS.COVERS });
  const productData = React.useContext(ProductDataCtx);

  const list = getOptionsToShow(
    productData.registers.insConditions,
    covers
  ).filter(({ code }) => code !== "sportK" && code !== "quarantineK");

  return list.map(({ code, name }) => (
    <CheckboxField
      key={code}
      name={`${FORM_PATHS.OPTIONS}.${code}`}
      label={name}
    />
  ));
};

export default Options;
