import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useWatch } from "react-hook-form";

import Citizenship from "./Citizenship";
import Person from "./Person";
import Document from "./Document";
import Address from "./Address";
import NextStepButton from "components/NextStepButton";
import { DataCtx as CalculationDataCtx } from "../CalculationProvider";
import { getPremiumByProgram } from "utils";
import { FORM_PATHS, PREMIUM_THRESHOLD } from "../../../constants";

const Policyholder = () => {
  const { setValue } = useFormContext();
  const [isCoverEstateOn, programCode] = useWatch({
    name: [FORM_PATHS.COVER_ESTATE_ON, FORM_PATHS.PROGRAM_CODE],
  });
  const calculationData = React.useContext(CalculationDataCtx);

  const showAdditionalFields =
    getPremiumByProgram(calculationData, programCode) > PREMIUM_THRESHOLD;

  React.useEffect(() => {
    if (!showAdditionalFields) {
      setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES, undefined);
      setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER, undefined);
      setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI, undefined);
      setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED, undefined);
      setValue(FORM_PATHS.POLICYHOLDER_ADDRESS, null);
    }
  }, [setValue, showAdditionalFields]);

  return (
    <>
      {!isCoverEstateOn && <Citizenship />}
      <Person />
      {showAdditionalFields && (
        <>
          <Document />
          <Address />
        </>
      )}
      <Row>
        <Col className="ml-auto" xs="auto">
          <NextStepButton color="primary" />
        </Col>
      </Row>
    </>
  );
};

export default Policyholder;
