import { Col, Row } from "reactstrap";

import Covers from "./Covers";
import Options from "./Options";
import NextStepButton from "components/NextStepButton";

const Additionals = () => (
  <>
    <Covers />
    <Row className="mt-3">
      <Col>
        <Options />
      </Col>
    </Row>
    <Row className="mt-3">
      <Col className="ml-auto" xs="auto">
        <NextStepButton color="primary" />
      </Col>
    </Row>
  </>
);

export default Additionals;
