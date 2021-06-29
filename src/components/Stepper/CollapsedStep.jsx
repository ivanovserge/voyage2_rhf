import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

import { useStepper } from "./";
import styles from "./Stepper.module.scss";

const CollapsedStep = ({ brief, index, isLast, isPrevious, title }) => {
  const { goToStep } = useStepper();

  const expand = () => goToStep(index, false);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div
          className={cn(
            "h5 font-weight-light text-secondary mb-0 WizardSectionTitle",
            isPrevious && styles.collapsedStepPreviousTitle
          )}
          onClick={() => isPrevious && expand()}
        >
          <span
            className={cn(isPrevious && styles.collapsedStepPreviousTitleText)}
          >
            {title}
          </span>
          {isPrevious && (
            <FontAwesomeIcon className="ml-2" icon={faChevronDown} size="xs" />
          )}
        </div>
        {isPrevious && (
          <div
            className={cn(
              "d-none d-md-block small text-secondary font-italic",
              styles.collapsedStepPreviousEdit
            )}
            onClick={expand}
          >
            изменить
          </div>
        )}
      </div>
      {!!brief &&
        isPrevious &&
        React.createElement(brief, { className: "wizardBrief" })}
      {!isLast && <hr />}
    </>
  );
};

export default CollapsedStep;
