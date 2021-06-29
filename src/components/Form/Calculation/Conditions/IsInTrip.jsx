import { Col, Row } from "reactstrap";
import { useFormState, useWatch } from "react-hook-form";
import get from "lodash.get";

import { CheckboxField } from "components/fields";
import { FORM_PATHS } from "../../../../constants";

const IsInTrip = ({ onChange }) => {
  const { touchedFields } = useFormState();
  const beginDate = useWatch({ name: FORM_PATHS.BEGIN_DATE });

  const rules = { onChange: (e) => onChange(e.target.value) };
  if (beginDate || get(touchedFields, FORM_PATHS.BEGIN_DATE)) {
    rules.deps = FORM_PATHS.BEGIN_DATE;
  }

  return (
    <Row className="mt-3">
      <Col>
        <CheckboxField
          name={FORM_PATHS.IS_IN_TRIP}
          rules={rules}
          label="Уже в поездке"
          type="switch"
        />
      </Col>
    </Row>
  );
};

export default IsInTrip;
