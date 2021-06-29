import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext } from "react-hook-form";

import CurrentStep from "./CurrentStep";
import CollapsedStep from "./CollapsedStep";
import { ProductDataCtx } from "App";
import { useWidth } from "hooks";

const StepperCtx = React.createContext();
export const useStepper = () => React.useContext(StepperCtx);

const Stepper = ({ children, onStepChange, sidebar, startStepIndex }) => {
  const { trigger } = useFormContext();
  const [currentStepIndex, setCurrentStepIndex] =
    React.useState(startStepIndex);
  const [shouldValidate, setShouldValidate] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const { info } = React.useContext(ProductDataCtx);

  React.useEffect(() => {
    setCurrentStepIndex(startStepIndex);
  }, [startStepIndex]);

  React.useEffect(() => {
    setTimeout(() => {
      if (shouldValidate) {
        trigger(undefined, { shouldFocus: true });
      }
    }, 20);

    return () => setShouldValidate(false);
  }, [currentStepIndex, shouldValidate, trigger]);

  const { down } = useWidth();
  const isMobile = down("md");

  const steps = React.Children.toArray(children);

  const goToNext = async () => {
    const isValid = await trigger(undefined, { shouldFocus: true });
    if (isValid) {
      const newStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(newStepIndex);
      onStepChange(newStepIndex);
    }
  };

  const goToStep = (stepIndex, validateOnShow = true) => {
    setCurrentStepIndex(stepIndex);
    onStepChange(stepIndex);
    if (validateOnShow) {
      setShouldValidate(true);
    }
  };

  const toggleInfo = () => setShowInfo((state) => !state);

  return (
    <StepperCtx.Provider
      value={{ currentStepIndex, goToNext, goToStep, stepCount: steps.length }}
    >
      <Row>
        <Col id="wizard-container" md={sidebar ? 9 : 12}>
          {!!info && showInfo && (
            <div
              dangerouslySetInnerHTML={{ __html: info }}
              id="RI-product-info"
            />
          )}
          <div id="RI-product-steps">
            {steps.map((el, idx, arr) => {
              const isLast = idx === arr.length - 1;
              if (idx === currentStepIndex) {
                const props = {};
                if (isMobile && isLast) {
                  // TODO: Или cloneElement()?
                  props.sidebar = React.createElement(sidebar, {
                    mobile: true,
                  });
                }
                return (
                  <CurrentStep key={el.key} index={idx} {...props}>
                    {el}
                  </CurrentStep>
                );
              } else {
                return (
                  <CollapsedStep
                    key={el.key}
                    brief={el.props.brief}
                    index={idx}
                    isLast={isLast}
                    isPrevious={idx < currentStepIndex}
                    title={el.props.title}
                  />
                );
              }
            })}
          </div>
        </Col>
        {!!sidebar && !isMobile && (
          <Col className="logicPanel" md={3}>
            {React.createElement(sidebar, { showInfo, toggleInfo })}
          </Col>
        )}
      </Row>
    </StepperCtx.Provider>
  );
};

Stepper.defaultProps = {
  onStepChange: () => {},
  startStepIndex: 0,
};

export default Stepper;
