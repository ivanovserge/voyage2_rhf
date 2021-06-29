import * as React from "react";
import { Alert, Col, Row } from "reactstrap";

import { ButtonsField } from "components/fields";
import { FORM_PATHS } from "../../../../constants";

const Currency = ({ onChange, options }) => (
  <Row className="mt-3">
    <Col>
      <div className="mb-2">Валюта и страховая сумма</div>
      {!!options.length && (
        <ButtonsField
          name={FORM_PATHS.CURRENCY}
          rules={{ onChange: (e) => onChange(e.target.value) }}
          options={options}
        />
      )}
      <Alert color="danger" isOpen={!options.length}>
        Для выбранного сочетания стран нет доступных валют!
      </Alert>
    </Col>
  </Row>
);

export default Currency;
