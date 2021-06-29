import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext } from "react-hook-form";

import { DateField, TextField } from "components/fields";
import { capitalizeName, parseToUTC } from "utils";
import { useSyncFullName } from "hooks";
import { REGEX_VALIDATION } from "../../../constants";

const Person = ({ isRussia, path }) => {
  const { setValue } = useFormContext();
  const syncFullName = useSyncFullName(path);

  React.useLayoutEffect(() => {
    if (!isRussia) {
      setValue(`${path}.middleName`, "");
      syncFullName();
    }
  }, [isRussia, path, setValue, syncFullName]);

  const staticValidate = REGEX_VALIDATION[isRussia ? "RU_EN" : "EN"];
  const labelPostfix = isRussia ? "" : " (латиницей)";

  return (
    <Row className="mt-3" form>
      <Col className="mb-3" md={4}>
        <div className="mb-2">Фамилия{labelPostfix}</div>
        <TextField
          name={`${path}.lastName`}
          defaultValue=""
          rules={{ onChange: syncFullName }}
          parse={capitalizeName}
          staticValidate={staticValidate}
          trimOnBlur
        />
      </Col>
      <Col className="mb-3" md={4}>
        <div className="mb-2">Имя{labelPostfix}</div>
        <TextField
          name={`${path}.firstName`}
          defaultValue=""
          rules={{ onChange: syncFullName }}
          parse={capitalizeName}
          staticValidate={staticValidate}
          trimOnBlur
        />
      </Col>
      {isRussia && (
        <Col className="mb-3" md={4}>
          <div className="mb-2">Отчество{labelPostfix}</div>
          <TextField
            name={`${path}.middleName`}
            defaultValue=""
            rules={{ onChange: syncFullName }}
            parse={capitalizeName}
            staticValidate={staticValidate}
            trimOnBlur
          />
        </Col>
      )}
      <Col className="mb-3" md={4}>
        <div className="mb-2">Дата рождения</div>
        <DateField name={`${path}.dob`} disabled parse={parseToUTC} />
      </Col>
    </Row>
  );
};

export default Person;
