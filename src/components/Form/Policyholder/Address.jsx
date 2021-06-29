import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";

import { ProductDataCtx } from "App";
import { DadataField, SelectField, TextField } from "components/fields";
import config from "config";
import { FORM_PATHS } from "../../../constants";

const Address = () => {
  const { getValues, setValue } = useFormContext();
  const { touchedFields } = useFormState();
  const [region, cdiDataFlat] = useWatch({
    name: [
      FORM_PATHS.POLICYHOLDER_ADDRESS_REGION,
      FORM_PATHS.POLICYHOLDER_CDI_DATA_FLAT,
    ],
  });
  const productData = React.useContext(ProductDataCtx);

  const regions = cloneDeep(productData.registers.subjectsRF);

  const regionRules = {
    required: "Не указан регион",
    validate: (value) => {
      if (!value) {
        return true;
      }
      const addressCdi = get(getValues(), FORM_PATHS.POLICYHOLDER_ADDRESS_CDI);
      const regionFiasId = addressCdi?.cdiData?.region_fias_id;
      if (!regionFiasId) {
        return true;
      }
      return (
        regionFiasId === value.fiasId ||
        "Указанный регион не совпадает с регионом указанного адреса"
      );
    },
  };

  const addressCdiRules = {
    required: "Не заполнен адрес",
    validate: (value) => {
      const regionFiasId = value.cdiData?.region_fias_id;
      if (!regionFiasId) {
        return true;
      }
      return (
        regions.some(({ fiasId }) => fiasId === regionFiasId) ||
        "Регион указанного адреса недоступен"
      );
    },
    onChange: (e) => {
      const { cdiData } = e.target.value;
      if (!cdiData) {
        return;
      }
      const regionFiasId = cdiData.region_fias_id;
      const flat = cdiData.flat;
      const region = regions.find(({ fiasId }) => fiasId === regionFiasId);
      if (region) {
        setValue(FORM_PATHS.POLICYHOLDER_ADDRESS_REGION, region, {
          shouldValidate: true,
        });
      }
      setValue(FORM_PATHS.POLICYHOLDER_ADDRESS_FLAT, flat ?? "");
    },
  };
  if (region || get(touchedFields, FORM_PATHS.POLICYHOLDER_ADDRESS_REGION)) {
    addressCdiRules.deps = FORM_PATHS.POLICYHOLDER_ADDRESS_REGION;
  }

  return (
    <Row form>
      <Col className="mb-3" xs={12}>
        <div className="mb-2">Регион</div>
        <SelectField
          name={FORM_PATHS.POLICYHOLDER_ADDRESS_REGION}
          rules={regionRules}
          isClearable
          options={regions}
          placeholder="Укажите регион"
        />
      </Col>
      <Col className="mb-3" md={10}>
        <div className="mb-2">Адрес регистрации</div>
        <DadataField
          name={FORM_PATHS.POLICYHOLDER_ADDRESS_CDI}
          rules={addressCdiRules}
          apiEndPoint={config.api}
          regionId={region?.fiasId}
        />
      </Col>
      <Col className="mb-3" md={2}>
        <div className="mb-2">Квартира</div>
        <TextField
          name={FORM_PATHS.POLICYHOLDER_ADDRESS_FLAT}
          defaultValue=""
          readOnly={!!cdiDataFlat}
        />
      </Col>
    </Row>
  );
};

export default Address;
