import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormState, useWatch } from "react-hook-form";
import get from "lodash.get";

import { ButtonsField } from "components/fields";
import { FORM_PATHS, TRIP_TYPES } from "../../../../constants";

const TripType = ({ onChange }) => {
  const { touchedFields } = useFormState();
  const [countries, beginDate] = useWatch({
    name: [FORM_PATHS.COUNTRIES, FORM_PATHS.BEGIN_DATE],
  });

  const rules = { onChange: (e) => onChange(e.target.value) };
  if (countries.length || get(touchedFields, FORM_PATHS.COUNTRIES)) {
    rules.deps = rules.deps || [];
    rules.deps.push(FORM_PATHS.COUNTRIES);
  }
  if (beginDate || get(touchedFields, FORM_PATHS.BEGIN_DATE)) {
    rules.deps = rules.deps || [];
    rules.deps.push(FORM_PATHS.BEGIN_DATE);
  }

  return (
    <Row className="mt-3">
      <Col>
        <div className="mb-2">Тип поездки</div>
        <ButtonsField
          name={FORM_PATHS.TRIP_TYPE}
          rules={rules}
          options={TRIP_TYPES}
        />
      </Col>
    </Row>
  );
};

export default TripType;
