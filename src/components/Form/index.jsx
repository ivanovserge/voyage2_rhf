import * as React from "react";
import { Container } from "reactstrap";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import qs from "qs";
import set from "lodash.set";

import CalculationProvider from "./CalculationProvider";
import Stepper from "components/Stepper";
import Calculation from "components/Form/Calculation";
import Additionals from "components/Form/Additionals";
import InsuredPersons from "components/Form/InsuredPersons";
import Policyholder from "components/Form/Policyholder";
import Purchase from "components/Form/Purchase";
import Sidebar from "components/Form/Sidebar";
import config from "../../config";
import { CurrentDateTimeCtx, ProductDataCtx } from "App";

import defaultValues from "../../defaultValues";
import { resolver } from "../../resolver";
import { FORM_PATHS } from "../../constants";

const Form = () => {
  const [payment, setPaymet] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const currentDateTime = React.useContext(CurrentDateTimeCtx);
  const {
    maquette,
    registers: { insConditions, voyage2EstateTypes },
  } = React.useContext(ProductDataCtx);

  const initialValues = {
    ...maquette,
    insConditions,
    ...defaultValues,
  };
  const { covers, options } = insConditions;
  const { luggageN } = covers.find(({ code }) => code === "luggage");
  set(initialValues, `${FORM_PATHS.TRAVELLERS}.0`, {
    dob: "",
    insVariant: { luggageN },
  });
  set(initialValues, FORM_PATHS.COVER_ESTATE_TYPE, voyage2EstateTypes[0]);
  covers.forEach(({ code }) =>
    set(initialValues, `${FORM_PATHS.COVERS}.${code}.on`, code === "medical")
  );
  options
    .filter(({ code }) => code !== "sportK" && code !== "quarantineK")
    .forEach(({ code }) =>
      set(initialValues, `${FORM_PATHS.OPTIONS}.${code}`, false)
    );

  const methods = useForm({
    mode: "all",
    defaultValues: initialValues,
    resolver,
    context: { currentDateTime, stepIndex },
  });

  const onSubmit = (values) => {
    if (payment) {
      return;
    }

    setPaymet(true);

    axios({
      url: config.api,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        operation: "Product.save",
        ns: "B2C",
        data: JSON.stringify({ data: values }),
      }),
      withCredentials: true,
    })
      .then((response) => {
        const result = response.data;
        if (!result.success) throw new Error(response);
        if (!!result.data.error) throw new Error(result.data.error);
        return result.data;
      })
      .catch((error) => {
        const message =
          (!!error.response && error.response.data.error) ||
          error.message ||
          "Произошла серверная ошибка";
        throw new Error(message);
      })
      .then((result) => {
        if (result.success && result.payUrl) {
          window.parent.postMessage(
            `__resolute__{"url":"${result.payUrl}"}`,
            "*"
          );
        } else {
          setPaymet(false);
        }
      });
  };

  return (
    <FormProvider {...methods}>
      <CalculationProvider>
        <Container onSubmit={methods.handleSubmit(onSubmit)} tag="form">
          <Stepper onStepChange={setStepIndex} sidebar={Sidebar}>
            <Calculation title="Расчёт" />
            <Additionals title="Популярные опции и дополнения" />
            <InsuredPersons title="Застрахованные лица" />
            <Policyholder title="Страхователь" />
            <Purchase title="Оплата" />
          </Stepper>
        </Container>
      </CalculationProvider>
    </FormProvider>
  );
};

export default Form;
