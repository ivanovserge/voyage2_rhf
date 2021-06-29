import * as React from "react";
import { Badge, Col, Row } from "reactstrap";
import { useFormContext, useWatch } from "react-hook-form";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";

import { SelectField } from "components/fields";
import { ProductDataCtx } from "App";
import { formatCountry, parseCountry, processCountries } from "utils";
import {
  FORM_PATHS,
  MAX_COUNTRY_COUNT,
  RUSSIA,
  WORLDWIDE,
} from "../../../../constants";

const Countries = ({ onChange }) => {
  const { getValues, setValue } = useFormContext();
  const countries = useWatch({ name: FORM_PATHS.COUNTRIES });
  const productData = React.useContext(ProductDataCtx);

  // Выключаем флаг "Уже в поездке" внутри useEffect(), поскольку нам нужно, чтобы это происходило после отправки запроса калькуляции.
  const isRussiaSelected = countries.some((el) => el.country.code === RUSSIA);
  React.useEffect(() => {
    if (isRussiaSelected) {
      const isInTrip = get(getValues(), FORM_PATHS.IS_IN_TRIP);
      if (isInTrip) {
        setValue(FORM_PATHS.IS_IN_TRIP, false);
      }
    }
  }, [getValues, isRussiaSelected, setValue]);

  const options = cloneDeep(productData.registers.countryVoyage2);
  const popular = options.filter(
    ({ code, popRegion }) =>
      popRegion && !countries.find((el) => el.country.code === code)
  );

  return (
    <Row className="mt-3">
      <Col>
        <div className="mb-2">Страны пребывания</div>
        <SelectField
          name={FORM_PATHS.COUNTRIES}
          rules={{ onChange: (e) => onChange(e.target.value) }}
          format={formatCountry}
          isMulti
          options={options}
          parse={parseCountry}
          placeholder="Выберите страну"
          processValueBeforeSelect={processCountries}
        />
        {!!popular.length && (
          <>
            <small>Популярные направления:</small>
            {popular.map((el) => {
              const isDisabled =
                countries.length > MAX_COUNTRY_COUNT && el.code !== WORLDWIDE;
              const props = {
                className: "ml-1",
                color: isDisabled ? "light" : "primary",
                onClick: (e) => {
                  if (!isDisabled) {
                    e.preventDefault();
                    const updatedCountries = parseCountry(
                      processCountries([...formatCountry(countries), el])
                    );
                    setValue(FORM_PATHS.COUNTRIES, updatedCountries, {
                      shouldValidate: true,
                    });
                    onChange(updatedCountries);
                  }
                },
              };
              !isDisabled && (props.href = "#");
              return (
                <Badge key={el.code} {...props}>
                  {el.name}
                </Badge>
              );
            })}
          </>
        )}
      </Col>
    </Row>
  );
};

export default Countries;
