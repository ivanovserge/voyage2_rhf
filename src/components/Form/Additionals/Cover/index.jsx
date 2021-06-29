import * as React from "react";
import { Col, CustomInput, Row } from "reactstrap";
import { useFormContext, useWatch } from "react-hook-form";
import cn from "classnames";
import get from "lodash.get";

import {
  ButtonsField,
  CheckboxField,
  NumberField,
  SelectField,
} from "components/fields";
import Currency from "components/Currency";
import Description from "./Description";
import { ProductDataCtx } from "App";
import { DataCtx as CalculationData } from "../../CalculationProvider";
import {
  getFormattedSum,
  getNeededToResetOptionCodes,
  getProgramsByCurrencyCode,
  isOptionEnabled,
} from "utils";
import { useUniqueId } from "hooks";
import {
  FORM_PATHS,
  COVER_NAMES,
  CURRENCY_SYMBOLS,
  QUARANTINE_OPTIONS,
} from "../../../../constants";
import styles from "./Cover.module.scss";

const Cover = ({ cover, isWorldwideOrUSA }) => {
  const { getValues, setValue } = useFormContext();
  const covers = useWatch({ name: FORM_PATHS.COVERS });
  const productData = React.useContext(ProductDataCtx);
  const calculationData = React.useContext(CalculationData);
  const tripCancelCheckboxId = useUniqueId();

  const { code, name, programs, limitType, limits, limitsRUR } = cover;

  const formValues = getValues();
  const currencyCode = get(formValues, FORM_PATHS.CURRENCY_CODE);
  const medicalProgramCode = get(formValues, FORM_PATHS.PROGRAM_CODE);
  const programOptions = getProgramsByCurrencyCode(
    programs,
    currencyCode
  ).filter(
    (el) => !isWorldwideOrUSA || (isWorldwideOrUSA && !el.data.nonWorldAndUSA)
  );

  if (!programOptions.length) {
    return null;
  }

  const isTripCancel = code === "tripCancel";
  const isRur = currencyCode === "RUR";

  let o2, o6, o2Code, o6Code;

  if (isTripCancel) {
    o2Code = isRur ? "O2RUR" : "O2";
    o6Code = isRur ? "O6RUR" : "O6";

    o2 = programOptions.find(({ code }) => code === o2Code);
    if (!o2) {
      return null;
    }

    o6 = programOptions.find(({ code }) => code === o6Code);
    if (!o6) {
      return null;
    }
  }

  const firstProgram = programOptions[0];

  const showPrograms =
    !isTripCancel && code !== "estate" && programOptions.length > 1;
  const programCode = covers[code]?.program?.code;

  const { insConditions } = productData.registers;

  let isQuarantineOptionEnabled;
  if (isTripCancel) {
    isQuarantineOptionEnabled = isOptionEnabled(
      "quarantineK",
      insConditions,
      covers
    );
  }

  const isOn = !!covers[code]?.on;

  const isLimitManual = limitType.code === "manual";
  const { maxLimit } = firstProgram;

  let renderedLimit;
  if (isLimitManual) {
    renderedLimit = (
      <NumberField
        name={`${FORM_PATHS.COVERS}.${code}.limit`}
        inputProps={{ suffix: ` ${CURRENCY_SYMBOLS[currencyCode]}` }}
        parse={(value) => {
          const parsedValue =
            parseFloat(value.replace(/ /g, "").replace(/,/g, ".")) || 0;
          return Math.max(Math.min(parsedValue, maxLimit), 1);
        }}
      />
    );
  } else {
    const limitsArr = isRur ? limitsRUR : limits;
    const limitOptions =
      code === "estate"
        ? limitsArr.reduce((acc, currVal) => {
            if (currVal.type !== "flat") {
              return acc;
            }
            if (!maxLimit || currVal.limit <= maxLimit) {
              acc.push(currVal);
            }
            return acc;
          }, [])
        : limitsArr.reduce((acc, currVal) => {
            if (!maxLimit || currVal <= maxLimit) {
              acc.push({ code: currVal, name: currVal });
            }
            return acc;
          }, []);

    renderedLimit = (
      <ButtonsField
        name={
          code === "estate"
            ? `${FORM_PATHS.COVERS}.${code}.insVariant`
            : `${FORM_PATHS.COVERS}.${code}.limit`
        }
        className={cn(!isOn && styles.isOff)}
        options={limitOptions}
        renderButtonName={(option) =>
          getFormattedSum(code === "estate" ? option.limit : option.code, {
            currency: currencyCode,
          })
        }
      />
    );
  }

  const calculationDataItem = calculationData.find(
    (el) => el.program.code === medicalProgramCode
  );
  const premium =
    calculationDataItem.logic.results.data?.preview[code]?.premiumRUR;

  const coverName = COVER_NAMES[code] || name;

  const onChange = (e) => {
    const checked = e.target.value;
    const covers = get(getValues(), FORM_PATHS.COVERS);

    if (!checked) {
      getNeededToResetOptionCodes(code, insConditions, covers).forEach((el) =>
        setValue(`${FORM_PATHS.OPTIONS}.${el}`, false)
      );
    }

    if (isTripCancel) {
      setValue(
        FORM_PATHS.OPTION_QUARANTINE,
        isOptionEnabled("quarantineK", insConditions, covers)
      );
      if (!checked) {
        setValue(FORM_PATHS.COVER_TRIP_CANCEL_PROGRAM, o2);
      }
    }
  };

  const onFlightDelayChange = (e) =>
    setValue(FORM_PATHS.COVER_TRIP_CANCEL_PROGRAM, e.target.checked ? o6 : o2);

  return (
    <>
      <Row className="mt-3">
        <Col>
          <CheckboxField
            name={`${FORM_PATHS.COVERS}.${code}.on`}
            rules={{ onChange }}
            label={coverName}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={{ size: 9, order: 1 }} xs={{ size: 12, order: 2 }}>
          {isTripCancel && isQuarantineOptionEnabled && (
            <ButtonsField
              name={FORM_PATHS.OPTION_QUARANTINE}
              className={cn("mb-2", !isOn && styles.isOff)}
              options={QUARANTINE_OPTIONS}
              trueOrFalse
            />
          )}
          {renderedLimit}
          {isTripCancel && (
            <div className="mt-2">
              <div className="mb-2">Добавить опцию:</div>
              <CustomInput
                checked={programCode === o6Code}
                disabled={!isOn}
                id={tripCancelCheckboxId}
                label="Задержка/отмена рейса"
                onChange={onFlightDelayChange}
                type="checkbox"
              />
              <div className="small text-muted">
                Доступна только с выбором <b>Отмена поездки</b>
              </div>
            </div>
          )}
          {showPrograms && (
            <div className="mt-2">
              <div className="mb-2">Программа</div>
              <SelectField
                name={`${FORM_PATHS.COVERS}.${code}.program`}
                options={programOptions}
              />
            </div>
          )}
          <Description cover={cover} />
        </Col>
        {!!premium && (
          <Col
            className={cn(
              "d-flex d-md-block align-items-center mb-2 mb-md-0",
              isOn ? "text-primary" : "text-black-50"
            )}
            md={{ size: 3, order: 2 }}
            xs={{ size: 12, order: 1 }}
          >
            <div className="small mr-2 mr-md-0">Стоимость:</div>
            <Currency
              className="h5 font-weight-bold"
              prefix="+ "
              value={premium}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default Cover;
