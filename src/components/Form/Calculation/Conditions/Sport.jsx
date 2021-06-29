import * as React from "react";
import { Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBiking,
  faSkating,
  faSkiing,
  faSkiingNordic,
  faSnowboarding,
  faSwimmer,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { useWatch } from "react-hook-form";

import { ButtonsField } from "components/fields";
import { ProductDataCtx } from "App";
import { isOptionEnabled } from "utils";
import { FORM_PATHS, OPTION_SPORT_OPTIONS } from "../../../../constants";

const Sport = () => {
  const [covers, optionSport] = useWatch({
    name: [FORM_PATHS.COVERS, FORM_PATHS.OPTION_SPORT],
  });
  const productData = React.useContext(ProductDataCtx);

  const isOptionSportEnabled = isOptionEnabled(
    "sportK",
    productData.registers.insConditions,
    covers
  );
  if (!isOptionSportEnabled) {
    return null;
  }

  return (
    <Row className="mt-3">
      <Col>
        <div className="mb-2">Защита при активном отдыхе</div>
        {optionSport !== false && (
          <div className="d-flex justify-content-between h1 text-primary border border-primary rounded py-2 py-md-3 px-1 px-md-4">
            <FontAwesomeIcon fixedWidth icon={faRunning} />
            <FontAwesomeIcon icon={faSnowboarding} />
            <FontAwesomeIcon flip="horizontal" icon={faSkiingNordic} />
            <FontAwesomeIcon icon={faSkiing} />
            <FontAwesomeIcon flip="horizontal" icon={faSkating} />
            <FontAwesomeIcon icon={faBiking} />
            <FontAwesomeIcon icon={faSwimmer} />
          </div>
        )}
        <ButtonsField
          name={FORM_PATHS.OPTION_SPORT}
          options={OPTION_SPORT_OPTIONS}
          trueOrFalse
        />
      </Col>
    </Row>
  );
};

export default Sport;
