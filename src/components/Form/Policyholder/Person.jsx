import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormState, useWatch } from "react-hook-form";
import { addDays, endOfDay, format, startOfDay, subYears } from "date-fns";
import { validate as validateEmail } from "email-validator";
import get from "lodash.get";

import { DateField, PhoneField, TextField } from "components/fields";
import { CurrentDateTimeCtx } from "App";
import { useFullName } from "hooks";
import { capitalizeName, parseToUTC } from "utils";
import {
  FORM_PATHS,
  MIN_POLICYHOLDER_AGE,
  MAX_POLICYHOLDER_AGE,
  DEFAULT_POLICYHOLDER_AGE,
} from "../../../constants";

const Person = () => {
  const { touchedFields } = useFormState();
  const [email, emailConfirm, citizenshipCode, documentDoi] = useWatch({
    name: [
      FORM_PATHS.POLICYHOLDER_EMAIL,
      FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM,
      FORM_PATHS.POLICYHOLDER_CITIZENSHIP_CODE,
      FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI,
    ],
  });
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  useFullName(FORM_PATHS.POLICYHOLDER);

  const isRussianCitizenship = citizenshipCode === "643";
  const regex = isRussianCitizenship
    ? /^[а-яА-ЯёЁ-\s]+$/
    : /^[a-zA-Zа-яА-ЯёЁ-\s]+$/;
  const message = isRussianCitizenship
    ? "Разрешены только русские буквы"
    : "Разрешены только русские и латинские буквы";
  const staticValidate = { pattern: regex, message };

  const minDob = startOfDay(
    addDays(subYears(currentDateTime, MAX_POLICYHOLDER_AGE - 1), 1)
  );
  const maxDob = endOfDay(subYears(currentDateTime, MIN_POLICYHOLDER_AGE));
  const defaultDob = startOfDay(
    subYears(currentDateTime, DEFAULT_POLICYHOLDER_AGE)
  );

  const dobRules = {
    required: "Не указана дата рождения",
    max: {
      value: maxDob,
      message: `Дата рождения не может быть позднее ${format(
        maxDob,
        "dd.MM.yyyy"
      )}`,
    },
    min: {
      value: minDob,
      message: `Дата рождения не может быть ранее ${format(
        minDob,
        "dd.MM.yyyy"
      )}`,
    },
    validate: (value) =>
      typeof value === "number" || "Не указана дата рождения",
  };
  if (documentDoi || get(touchedFields, FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI)) {
    dobRules.deps = FORM_PATHS.POLICYHOLDER_DOCUMENT_DOI;
  }

  const emailFieldProps = {
    name: FORM_PATHS.POLICYHOLDER_EMAIL,
    rules: {
      required: "Не указан e-mail",
      validate: (value) => validateEmail(value) || "Некорректный формат e-mail",
    },
    type: "email",
  };
  if (
    emailConfirm ||
    get(touchedFields, FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM)
  ) {
    emailFieldProps.rules.deps = FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM;
  }

  const emailConfirmFieldProps = {
    name: FORM_PATHS.POLICYHOLDER_EMAIL_CONFIRM,
    rules: {
      required: email ? "Подтвердите e-mail" : false,
      validate: (value) => {
        if (!email) {
          return true;
        }
        return validateEmail(value)
          ? value === email || "Адреса e-mail не совпадают"
          : "Некорректный формат e-mail";
      },
    },
    disablePast: true,
    type: "email",
  };

  return (
    <>
      <Row className="mt-3" form>
        <Col md={4} className="mb-3">
          <div className="mb-2">Фамилия</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_LAST_NAME}
            rules={{
              required: "Не указана фамилия",
              pattern: { value: regex, message },
            }}
            parse={capitalizeName}
            staticValidate={staticValidate}
            trimOnBlur
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Имя</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_FIRST_NAME}
            rules={{
              required: "Не указано имя",
              pattern: { value: regex, message },
            }}
            parse={capitalizeName}
            staticValidate={staticValidate}
            trimOnBlur
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Отчество</div>
          <TextField
            name={FORM_PATHS.POLICYHOLDER_MIDDLE_NAME}
            rules={{ pattern: { value: regex, message } }}
            parse={capitalizeName}
            staticValidate={staticValidate}
            trimOnBlur
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Дата рождения</div>
          <DateField
            name={FORM_PATHS.POLICYHOLDER_DOB}
            rules={dobRules}
            defaultDate={defaultDob}
            maxDate={maxDob}
            minDate={minDob}
            parse={parseToUTC}
          />
        </Col>
        <Col md={4} className="mb-3">
          <div className="mb-2">Мобильный телефон</div>
          <PhoneField
            name={`${FORM_PATHS.POLICYHOLDER}.phone`}
            rules={{ required: "Не указан номер телефона" }}
            placeholder="+7(___)___-__-__"
          />
        </Col>
      </Row>
      <Row form>
        <Col md={4} className="mb-3">
          <div className="mb-2">E-mail</div>
          <TextField {...emailFieldProps} />
        </Col>
        <Col md={8} className="mb-3">
          <div className="mb-2">Подтвердите e-mail</div>
          <Row form>
            <Col md={6}>
              <TextField {...emailConfirmFieldProps} />
            </Col>
            <Col md={6} className="small font-italic">
              Страховой полис будет выслан на указанный <nobr>e-mail</nobr>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Person;
