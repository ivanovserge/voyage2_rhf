import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { format, startOfDay } from "date-fns";
import get from "lodash.get";

import {
  DateField,
  MaskedField,
  SelectField,
  TextField,
} from "components/fields";
import { CurrentDateTimeCtx } from "App";
import { parseToUTC } from "utils";
import {
  FORM_PATHS,
  DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
  DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION,
} from "../../../constants";

const Document = () => {
  const { setValue } = useFormContext();
  const { errors } = useFormState();
  const [policyholderDob, typeCode, typeName, series, number, doi, issued] =
    useWatch({
      name: [
        FORM_PATHS.POLICYHOLDER_DOB,
        FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE_CODE,
        FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE_NAME,
        FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES,
        FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER,
        FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI,
        FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED,
      ],
    });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);

  const seriesError = get(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES);
  const numberError = get(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER);
  const doiError = get(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI);
  const issuedError = get(errors, FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED);

  React.useEffect(() => {
    let name = "";
    if (!seriesError && !numberError && !doiError && !issuedError) {
      if (series) {
        name += series + " ";
      }
      if (number) {
        name += number;
        if (doi && issued) {
          name += `, выдан ${issued}, ${format(doi, "dd.MM.yyyy")}`;
        }
      }
    }
    setValue(FORM_PATHS.POLICYHOLDER_DOCUMENT_NAME, name);
  }, [
    doi,
    doiError,
    issued,
    issuedError,
    number,
    numberError,
    series,
    seriesError,
    setValue,
  ]);

  const seriesRegex = /^[A-ZА-Я0-9- ]+$/i;
  const seriesMessage = "Разрешены только кириллица, латиница, дефис";
  const seriesProps = {
    name: FORM_PATHS.POLICYHOLDER_DOCUMENT_SERIES,
    defaultValue: "",
    placeholder: "Серия",
  };

  const numberRegex = /^[0-9]+$/i;
  const numberMessage = "Разрешены только цифры";
  const numberProps = {
    name: FORM_PATHS.POLICYHOLDER_DOCUMENT_NUMBER,
    defaultValue: "",
    placeholder: "Номер",
  };

  const isPassportRussian =
    typeCode === DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION.code;
  const isPassportForeign =
    typeCode === DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION.code;

  const isPolicyholderDobNumber = typeof policyholderDob === "number";
  const maxDoi = startOfDay(currentDateTime);
  const minDoi = startOfDay(
    isPolicyholderDobNumber ? policyholderDob : new Date(1900, 0, 1, 0, 0, 0, 0)
  );
  const defaultDoi = maxDoi;
  const doiRules = {
    required: "Не указана дата выдачи паспорта",
    max: {
      value: maxDoi,
      message: `Дата выдачи паспорта не может быть позднее ${format(
        maxDoi,
        "dd.MM.yyyy"
      )}`,
    },
    min: {
      value: minDoi,
      message: isPolicyholderDobNumber
        ? "Дата выдачи паспорта не может быть ранее даты рождения"
        : `Дата выдачи паспорта не может быть ранее ${format(
            minDoi,
            "dd.MM.yyyy"
          )}`,
    },
    validate: (value) =>
      typeof value === "number" || "Не указана дата выдачи паспорта",
  };

  return (
    <Row form>
      <Col className="mb-3" md={4}>
        <div className="mb-2">Тип документа</div>
        <SelectField
          name={FORM_PATHS.POLICYHOLDER_DOCUMENT_TYPE}
          disabled
          options={[
            DOCUMENT_TYPE_RUSSIAN_PASSPORT_OPTION,
            DOCUMENT_TYPE_FOREIGN_PASSPORT_OPTION,
          ]}
        />
      </Col>
      <Col md={8} xs={12}>
        <div className="mb-2">{typeName}</div>
        <Row form md={2} xs={1}>
          <Col className="mb-3">
            {isPassportRussian && (
              <MaskedField
                {...seriesProps}
                rules={{ required: "Не указана серия паспорта" }}
                mask={[/\d/, /\d/, /\d/, /\d/]}
                placeholderChar="✻"
              />
            )}
            {isPassportForeign && (
              <TextField
                {...seriesProps}
                rules={{
                  required: false,
                  pattern: { value: seriesRegex, message: seriesMessage },
                }}
                inputProps={{ maxLength: 8 }}
                staticValidate={{
                  pattern: seriesRegex,
                  message: seriesMessage,
                }}
              />
            )}
          </Col>
          <Col className="mb-3">
            {isPassportRussian && (
              <MaskedField
                {...numberProps}
                rules={{ required: "Не указан номер паспорта" }}
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                placeholderChar="✻"
              />
            )}
            {isPassportForeign && (
              <TextField
                {...numberProps}
                rules={{
                  required: "Не указан номер паспорта",
                  pattern: { value: numberRegex, message: numberMessage },
                }}
                inputProps={{ maxLength: 10 }}
                staticValidate={{
                  pattern: numberRegex,
                  message: numberMessage,
                }}
              />
            )}
          </Col>
        </Row>
      </Col>
      {isPassportRussian && (
        <>
          <Col className="mb-3" md={4}>
            <div className="mb-2">Дата выдачи</div>
            <DateField
              name={FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI}
              defaultValue=""
              rules={doiRules}
              defaultDate={defaultDoi}
              maxDate={maxDoi}
              minDate={policyholderDob || minDoi}
              parse={parseToUTC}
            />
          </Col>
          <Col className="mb-3" md={8}>
            <div className="mb-2">Кем выдан</div>
            <TextField
              name={FORM_PATHS.POLICYHOLDER_DOCUMENT_ISSUED}
              defaultValue=""
              rules={{ required: "Не указано кем выдан паспорт" }}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default Document;
