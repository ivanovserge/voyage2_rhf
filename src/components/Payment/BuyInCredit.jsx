import * as React from "react";
import {
  Button,
  Col,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from "reactstrap";

import { ProductDataCtx } from "App";
import { HOSTS_FOR_CREDIT } from "../../constants";

const BuyInCredit = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [top, setTop] = React.useState(0);
  const [showInfo, setShowInfo] = React.useState(false);
  const productData = React.useContext(ProductDataCtx);

  React.useEffect(() => {
    const onScroll = (e) => {
      const { parentScroll } = e.data;
      if (parentScroll !== undefined) {
        setTop(parentScroll);
      }
    };
    window.addEventListener("message", onScroll);
    return () => window.removeEventListener("message", onScroll);
  }, []);

  if (!HOSTS_FOR_CREDIT.includes(productData.maquette.host)) {
    return null;
  }

  const onButtonClick = () => {
    setIsModalOpen(true);
  };

  const onShowInfoClick = () => {
    setShowInfo(true);
  };

  const onNotInterestedClick = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button className="mr-2" onClick={onButtonClick}>
        Купить со скидкой
      </Button>
      <Modal
        backdropClassName="bg-light"
        isOpen={isModalOpen}
        scrollable
        size="lg"
        style={{ marginTop: top }}
        toggle={() => setIsModalOpen(false)}
      >
        <div className="bg-primary" style={{ height: 5 }} />
        <ModalHeader toggle={() => setIsModalOpen(false)}>
          ПОКУПКА ПОЛИСА В КРЕДИТ
        </ModalHeader>
        <ModalBody>
          {showInfo ? (
            <Row className="small">
              <Col md={{ size: 8, offset: 2 }}>
                <FormGroup>
                  <b>Спасибо за ваш интерес!</b>
                  <br />
                  Мы проводим исследование и планируем, что оплата полисов в
                  кредит будет доступна в ближайшее время, чтобы защита вашего
                  здоровья и имущества стала еще проще.
                </FormGroup>
                <div className="text-center">
                  <Button color="primary" onClick={() => setIsModalOpen(false)}>
                    Закрыть
                  </Button>
                </div>
              </Col>
            </Row>
          ) : (
            <>
              <Row className="small">
                <Col md={6} className="pl-md-5">
                  <FormGroup>
                    <b>Приобретите полис со скидкой 10%!</b>
                    <br />
                    1. Оформите прямо сейчас виртуальную кредитную карту банка
                    «Открытия».
                    <br />
                    2. Оплатите ей полис. Скидка 10% применится автоматически
                    при вводе карты.
                    <br />
                    3. Получите дополнительный кэшбэк 2% со стоимости полиса.
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <b>Преимущества кредитной карты «Открытия»:</b>
                    <br />• 0% комиссия за обслуживание.
                    <br />• До 2% кэшбэк за все.
                    <br />• 55 дней льготный период.
                    <br />• Быстрое онлайн-оформление только по паспорту.
                  </FormGroup>
                </Col>
              </Row>
              <hr />
              <Row form>
                <Col>
                  <div className="text-center">
                    <Button color="primary" onClick={onNotInterestedClick}>
                      Не интересно
                    </Button>
                  </div>
                </Col>
                <Col>
                  <div className="text-center">
                    <Button color="primary" onClick={onShowInfoClick}>
                      Интересно
                    </Button>
                  </div>
                </Col>
              </Row>
              <div
                className="p-0 p-md-4 mt-4 mt-md-0"
                style={{ fontSize: "11px" }}
              >
                Кредитная банковская карта Opencard (Открытая карта). Кэшбэк
                (cash-back) — возврат средств. Валюта счета – рубли РФ. Размер
                начислений бонусных рублей зависит от выполнения следующих
                условий в отчетном календарном месяце. Стоимость выпуска карты
                Opencard 500 руб. Бонусные рубли не начисляются на категории:
                квази-кэш, денежные переводы, брокерские операции. Мин.
                ежемесячный платеж – 3% от суммы основного долга на конец
                расчетного периода (но не менее 300 руб.) + сумма начисленных
                процентов; не взимается в течение льготного периода
                кредитования. Полные условия оформления и использования карт – в
                Сборнике тарифов банка на open.ru. ПАО Банк «ФК Открытие». Ген.
                лицензия Банка России № 2209 от 24. 11. 2014. 115114, г. Москва,
                ул. Летниковская, д. 2, стр. 4. Реклама.
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default BuyInCredit;
