import * as React from "react";
import { Col, Row, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useFormContext } from "react-hook-form";

import { DataCtx, ErrorCtx } from "../../../CalculationProvider";
import Currency from "components/Currency";
import NextStepButton from "components/NextStepButton";
import config from "./config";
import { FORM_PATHS } from "../../../../../constants";

const ProgramsTable = () => {
  const { setValue } = useFormContext();
  const data = React.useContext(DataCtx);
  const error = React.useContext(ErrorCtx);

  if (!data?.length || error) {
    return null;
  }

  const programs = data.filter((el) => el.program.code !== "comfort");
  const hasWarnings = programs.some((el) => el.logic.warnings.length);

  if (hasWarnings) {
    return null;
  }

  return (
    <Row className="mt-3">
      <Col>
        <div className="mb-2">Выберите программу</div>
        <Table className="mb-0" responsive striped>
          <thead>
            <tr>
              <th />
              {programs.map((el) => {
                const { code, name } = el.program;
                const premium = el.logic.results.risks.medical.data.premiumRUR;
                return (
                  <th
                    key={code}
                    className="text-primary text-center font-weight-normal"
                  >
                    <div>{name}</div>
                    <Currency
                      className="text-nowrap font-weight-bold"
                      value={premium}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {config.map((el, idx) => (
              <tr key={idx}>
                <td className="small font-italic">{el.name}</td>
                {programs.map(({ program: { code } }) => (
                  <td key={code} className="text-primary text-center">
                    {el[code] && <FontAwesomeIcon icon={faCheck} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="pb-0" />
              {programs.map(({ program }) => {
                const { code, name } = program;
                return (
                  <td key={code} className="text-primary pb-0">
                    <NextStepButton
                      color="primary"
                      onBeforeClick={() =>
                        setValue(FORM_PATHS.PROGRAM, program)
                      }
                      size="sm"
                    >
                      Купить "{name}"
                    </NextStepButton>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </Table>
      </Col>
    </Row>
  );
};

export default ProgramsTable;
