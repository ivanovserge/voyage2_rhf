import * as React from "react";
import { Col, Row } from "reactstrap";

import { ButtonsField } from "components/fields";
import { FORM_PATHS, TRIP_PERIODS } from "../../../../constants";

const TripPeriod = () => (
  <Row className="mt-3">
    <Col>
      <div className="mb-2">Количество застрахованных дней в году</div>
      <ButtonsField name={FORM_PATHS.TRIP_PERIOD} options={TRIP_PERIODS} />
    </Col>
  </Row>
);

export default TripPeriod;
