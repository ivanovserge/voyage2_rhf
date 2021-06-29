import { CustomInput } from "reactstrap";

import Currency from "components/Currency";
import { useUniqueId } from "hooks";

const ProgramCheckbox = ({ checked, label, onChange, premium }) => {
  const id = useUniqueId();

  return (
    <>
      <CustomInput
        checked={checked}
        className="logicPanelInput mb-2"
        id={id}
        label={label}
        onChange={onChange}
        type="radio"
      />
      <Currency
        className="d-block h5 text-primary text-nowrap font-weight-bold text-left text-md-right mb-2"
        value={premium}
      />
    </>
  );
};

export default ProgramCheckbox;
