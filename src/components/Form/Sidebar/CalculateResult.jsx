import * as React from "react";
import { useFormContext } from "react-hook-form";
import get from "lodash.get";

import Currency from "components/Currency";
import Sconto from "../Sconto";
import ProgramCheckbox from "./ProgramCheckbox";
import { DataCtx } from "components/Form/CalculationProvider";
import { useStepper } from "components/Stepper";
import { getPremiumByProgram } from "utils";
import {
  FORM_PATHS,
  PREMIUM_PATH,
  COVER_NAMES,
  PREMIUM_THRESHOLD,
} from "../../../constants";

const CalculateResult = () => {
  const { getValues, setValue } = useFormContext();
  const data = React.useContext(DataCtx);
  const { currentStepIndex, goToStep, stepCount } = useStepper();

  const programCode = get(getValues(), FORM_PATHS.PROGRAM_CODE);
  const [premium, setPremium] = React.useState(() =>
    getPremiumByProgram(data, programCode)
  );

  const didMountRef = React.useRef(true);
  React.useEffect(() => {
    if (!didMountRef.current) {
      setPremium(getPremiumByProgram(data, programCode));
    } else {
      didMountRef.current = false;
    }
  }, [data, programCode]);

  const onCheck = (program) => () => {
    const dataItemByProgram = data.find(
      (el) => el.program.code === program.code
    );
    const premium = get(dataItemByProgram, PREMIUM_PATH);
    if (currentStepIndex === stepCount - 1 && premium > PREMIUM_THRESHOLD) {
      goToStep(3);
    }
    setValue(FORM_PATHS.PROGRAM, program);
    setPremium(premium);
  };

  const dataItemByProgram = data.find((el) => el.program.code === programCode);

  const renderedCovers = Object.entries(
    dataItemByProgram.logic.results.data.covers
  ).filter(([code]) => code !== "medical");
  const renderedOptions = Object.entries(
    dataItemByProgram.logic.results.data.options
  );

  const tripCancelCover = renderedCovers.find(
    ([code]) => code === "tripCancel"
  );
  const tripCancelProgramCode = tripCancelCover?.[1].program.code;

  return (
    <>
      <div className="logicPanelName mb-2">
        Выберите программу
        <br />
        (Covid-19 включен)
      </div>
      {data.map(({ program, logic }) => (
        <ProgramCheckbox
          key={program.code}
          checked={program.code === programCode}
          label={program.name}
          onChange={onCheck(program)}
          premium={logic.results.risks.medical.data.premiumRUR}
        />
      ))}
      {!!renderedCovers.length && (
        <>
          <div className="small">Дополнения</div>
          {renderedCovers.map(([code, { name, premiumRUR }]) => (
            <div
              key={code}
              className="d-flex justify-content-between small text-primary font-italic"
            >
              <div className="pr-2">+ {COVER_NAMES[code] || name}</div>
              <div className="pl-2 text-nowrap">{premiumRUR} руб.</div>
            </div>
          ))}
        </>
      )}
      {!!renderedOptions.length && (
        <>
          <div className="small mt-2">Опции</div>
          {tripCancelProgramCode === "O6" && (
            <div className="small text-primary font-italic">
              + Задержка/отмена рейса
            </div>
          )}
          {renderedOptions.map(([code, { name }]) => (
            <div key={code} className="small text-primary font-italic">
              + {name}
            </div>
          ))}
        </>
      )}
      <div className="logicPanelTotal d-flex justify-content-between mt-2">
        <div className="pr-2">Итого:</div>
        <Currency
          className="pl-2 h5 text-primary text-nowrap font-weight-bold"
          value={premium}
        />
      </div>
      <Sconto />
    </>
  );
};

export default CalculateResult;
