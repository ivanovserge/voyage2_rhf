import * as React from "react";
import { Alert, Col, Row } from "reactstrap";
import NumberFormat from "react-number-format";

import { ButtonsField } from "components/fields";
import { FORM_PATHS, INTEGER_FORMAT_PROPS } from "../../../../constants";

const Limit = ({ options }) => (
  <Row className="mt-3">
    <Col>
      {!!options.length && (
        <ButtonsField
          name={FORM_PATHS.LIMIT}
          options={options}
          renderButtonName={({ code }) => (
            <NumberFormat {...INTEGER_FORMAT_PROPS} value={code} />
          )}
        />
      )}
      <Alert color="danger" isOpen={!options.length}>
        Для выбранного сочетания стран и валюты нет доступных страховых сумм
      </Alert>
    </Col>
  </Row>
);

export default Limit;
