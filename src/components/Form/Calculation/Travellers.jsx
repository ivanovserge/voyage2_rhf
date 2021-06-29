import * as React from "react";
import { Alert, Button, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useFieldArray } from "react-hook-form";

import { DateField } from "components/fields";
import { CurrentDateTimeCtx, ProductDataCtx } from "App";
import { getMaxTravellerDob, getMinTravellerDob, parseToUTC } from "utils";
import { FORM_PATHS, MAX_TRAVELLER_COUNT } from "../../../constants";

const Travellers = () => {
  const { fields, append, remove } = useFieldArray({
    name: FORM_PATHS.TRAVELLERS,
  });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const productData = React.useContext(ProductDataCtx);

  const { luggageN } = productData.registers.insConditions.covers.find(
    ({ code }) => code === "luggage"
  );

  const minDob = getMinTravellerDob(currentDateTime);
  const maxDob = getMaxTravellerDob(currentDateTime);

  const canAdd = fields.length < MAX_TRAVELLER_COUNT;
  const canRemove = fields.length > 1;

  return (
    <>
      <Row className="mt-3">
        <Col md={6} xs={12}>
          <div className="mb-2">
            Количество и даты рождения путешественников
          </div>
          {fields.map(({ id }, idx) => (
            <div key={id} className="d-flex mb-2">
              <div className="btn bg-primary text-white mr-2">{idx + 1}</div>
              <DateField
                name={`${FORM_PATHS.TRAVELLERS}.${idx}.dob`}
                className="w-100"
                defaultDate={maxDob}
                maxDate={maxDob}
                minDate={minDob}
                parse={parseToUTC}
              />
              <Button
                className="ml-2"
                color="light"
                disabled={!canRemove}
                onClick={() => remove(idx)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          ))}
          {canAdd && (
            <Button
              color="primary"
              onClick={() => append({ dob: "", insVariant: { luggageN } })}
              outline
            >
              Добавить путешественника
            </Button>
          )}
        </Col>
      </Row>
      {!canAdd && (
        <Row>
          <Col>
            <Alert color="warning">
              В один полис можно добавить не более {MAX_TRAVELLER_COUNT}{" "}
              путешественников.
            </Alert>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Travellers;
