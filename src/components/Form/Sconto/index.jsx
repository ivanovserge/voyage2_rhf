import * as React from "react";
import {
  Alert,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { useFormContext, useWatch } from "react-hook-form";
import { CancelToken, isCancel } from "axios";
import cn from "classnames";

import { ProductDataCtx } from "App";
import { useDebounce } from "hooks";
import { fetchApi } from "utils";
import { FORM_PATHS } from "../../../constants";
import styles from "./styles.module.scss";

const Sconto = () => {
  const { setValue } = useFormContext();
  const percent = useWatch({ name: FORM_PATHS.SCONTO_PERCENT });
  const [dataLoading, setDataLoading] = React.useState();
  const [dataError, setDataError] = React.useState();
  const [promocode, setPromocode] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [top, setTop] = React.useState(0);
  const topDebounced = useDebounce(top, 50);
  const { acceptPromo } = React.useContext(ProductDataCtx);

  React.useEffect(() => {
    const onScrollMessage = (e) => {
      const { parentScroll } = e.data;
      if (parentScroll !== undefined) {
        setTop(parentScroll);
      }
    };
    window.addEventListener("message", onScrollMessage);
    return () => window.removeEventListener("message", onScrollMessage);
  }, []);

  const sourceRef = React.useRef(null);

  const checkPromocode = () => {
    sourceRef.current?.cancel();
    sourceRef.current = CancelToken.source();

    fetchApi(
      "Product.checkPromocode",
      "B2C",
      { product: "voyage2", promocode },
      sourceRef.current.token
    )
      .then((res) => {
        const { data, success, error } = res.data;
        if (!success) {
          throw new Error(error);
        }
        setValue(FORM_PATHS.SCONTO, data);
        setDataError("");
        setIsModalOpen(false);
      })
      .catch((err) => {
        if (!isCancel(err)) {
          setValue(FORM_PATHS.SCONTO, null);
          const message =
            (err.response
              ? err.response.data.error
              : err.request
              ? err.request.statusText
              : err.message) || "Checking promocode request failed.";
          setDataError(message);
          console.error(err);
        }
      })
      .finally(() => setDataLoading(false));
  };

  const toggleModal = () => setIsModalOpen((state) => !state);

  const modalStyle = {
    marginTop: topDebounced,
    transition: "margin-top .4s",
  };

  return (
    <>
      {!!percent && (
        <div className="my-2">
          <span
            className={cn(
              "font-italic text-secondary small logicPanelSconto",
              styles.sconto
            )}
          >
            Стоимость уменьшена на {percent}%
          </span>
        </div>
      )}

      {acceptPromo && (
        <>
          <Button
            block
            className="mt-3"
            color="primary"
            onClick={() => setIsModalOpen(true)}
            size="sm"
          >
            Уменьшить стоимость
          </Button>

          <Modal
            className="shadow"
            backdropClassName="bg-light"
            isOpen={isModalOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkPromocode();
              }
            }}
            style={modalStyle}
            toggle={toggleModal}
          >
            <ModalHeader toggle={toggleModal}>Уменьшить стоимость</ModalHeader>
            <ModalBody>
              <div className="mb-2">Промокод</div>
              <Input
                autoFocus
                disabled={dataLoading}
                onChange={(e) => setPromocode(e.target.value)}
                placeholder="Введите промокод"
                value={promocode}
              />
              {!!dataError && (
                <Alert color="danger" className="mb-0 mt-3">
                  {dataError}
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                disabled={!promocode || dataLoading}
                onClick={checkPromocode}
              >
                Применить
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
};

export default Sconto;
