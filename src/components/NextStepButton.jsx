import { Button } from "reactstrap";
import { useFormState } from "react-hook-form";

import { useStepper } from "components/Stepper";

const NextStepButton = ({ children, onBeforeClick, ...props }) => {
  const { isValidating } = useFormState();
  const { goToNext } = useStepper();

  const onClick = () => {
    onBeforeClick();
    goToNext();
  };

  return (
    <Button disabled={isValidating} onClick={onClick} {...props}>
      {children || "Продолжить"}
    </Button>
  );
};

NextStepButton.defaultProps = {
  onBeforeClick: () => {},
};

export default NextStepButton;
