import * as React from "react";
import { Alert, Spinner } from "reactstrap";
import { Helmet } from "react-helmet";
import { differenceInMilliseconds } from "date-fns";
import { CancelToken, isCancel } from "axios";

import Form from "components/Form";
import { isMedicalOn, fetchApi } from "utils";

export const CurrentDateTimeCtx = React.createContext();
export const ProductDataCtx = React.createContext();
export const ProductDataLoadingCtx = React.createContext();
export const ProductDataErrorCtx = React.createContext();

const App = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState();
  const [error, setError] = React.useState();
  const [currentDateTime, setCurrentDateTime] = React.useState(0);

  React.useEffect(() => {
    const date = new Date();
    const source = CancelToken.source();

    fetchApi(
      "Product.getProdData",
      "B2C",
      {
        productCode: "voyage2",
        referrer: "http://localhost:3000/",
        timezoneOffset: date.getTimezoneOffset(),
      },
      source.token
    )
      .then((res) => {
        const { data, success, error } = res.data;
        if (!success) {
          throw new Error(error);
        }
        setData(data);
        setError("");

        const { serverTime } = data;
        const timeLag = serverTime
          ? differenceInMilliseconds(date, serverTime)
          : 0;
        const currentDate = new Date(date.getTime() - timeLag);
        setCurrentDateTime(currentDate.getTime());
      })
      .catch((err) => {
        if (!isCancel(err)) {
          const message =
            (err.response
              ? err.response.data.error
              : err.request
              ? err.request.statusText
              : err.message) || "Getting product data request failed.";
          setError(message);
          console.error(err);
        }
      })
      .finally(() => setLoading(false));

    return () => source.cancel();
  }, []);

  if (!data) {
    return null;
  }

  if (loading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    <Alert color="danger">{error}</Alert>;
  }

  const { maquette, registers, css } = data;

  if (!maquette || !registers) {
    return <Alert color="danger">Приложение запущено с ошибкой!</Alert>;
  }

  const {
    curRates,
    insConditions,
    subjectsRF,
    skkCountries,
    countryVoyage2,
    voyage2EstateTypes,
  } = registers;

  if (!curRates?.length) {
    return <Alert color="danger">Не удалось получить курсы валют!</Alert>;
  }
  if (!insConditions) {
    return (
      <Alert color="danger">Не удалось получить условия страхования!</Alert>
    );
  } else if (!isMedicalOn(insConditions)) {
    return (
      <Alert color="danger">
        Страхование в части медицинской и экстренной помощи отключено!
      </Alert>
    );
  }
  if (!subjectsRF?.length) {
    return (
      <Alert color="danger">Не удалось получить справочник регионов!</Alert>
    );
  }
  if (!skkCountries?.length) {
    return (
      <Alert color="danger">Не удалось получить справочник skkCountries!</Alert>
    );
  }
  if (!countryVoyage2?.length) {
    return <Alert color="danger">Не удалось получить справочник стран!</Alert>;
  }
  if (!voyage2EstateTypes?.length) {
    return (
      <Alert color="danger">Не удалось получить справочник типов жилья!</Alert>
    );
  }

  return (
    <>
      {!!css && (
        <Helmet>
          <style type="text/css">{css}</style>
        </Helmet>
      )}
      <CurrentDateTimeCtx.Provider value={currentDateTime}>
        <ProductDataCtx.Provider value={data}>
          <ProductDataLoadingCtx.Provider value={loading}>
            <ProductDataErrorCtx.Provider value={error}>
              <Form />
            </ProductDataErrorCtx.Provider>
          </ProductDataLoadingCtx.Provider>
        </ProductDataCtx.Provider>
      </CurrentDateTimeCtx.Provider>
    </>
  );
};

export default App;
