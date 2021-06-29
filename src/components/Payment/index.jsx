import * as React from "react";
import { Button } from "reactstrap";
import { useFormState } from "react-hook-form";
import { useWatch } from "react-hook-form";

import Instruments from "./Instruments";
import BuyInCredit from "./BuyInCredit";
import { ProductDataCtx } from "App";
import { FORM_PATHS } from "../../constants";

const Payment = ({ disabled }) => {
  const { isSubmitting } = useFormState();
  const name = useWatch({ name: FORM_PATHS.PAYMENT_INSTRUMENT_NAME });
  const { payInstruments } = React.useContext(ProductDataCtx);

  const showInstruments = payInstruments.length > 1;

  const buttonsBlock = (
    <div className="mt-3 text-right">
      <BuyInCredit />
      <Button
        color="primary"
        disabled={disabled || isSubmitting || (showInstruments && !name)}
        type="submit"
      >
        Оплатить
      </Button>
    </div>
  );

  return showInstruments ? (
    <>
      <div>
        {!!name ? (
          <>
            Оплата через сервис <b>{name}</b>
          </>
        ) : (
          "Выберите сервис оплаты:"
        )}
      </div>
      <Instruments />
      <hr />
      {buttonsBlock}
    </>
  ) : (
    buttonsBlock
  );
};

export default Payment;
