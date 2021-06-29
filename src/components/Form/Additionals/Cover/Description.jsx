import NumberFormat from "react-number-format";
import { useWatch } from "react-hook-form";

import { getNoun } from "utils";
import { FORM_PATHS, INTEGER_FORMAT_PROPS } from "../../../../constants";

const Limit = ({ cover: { code, limitType } }) => {
  const limitPath = `${FORM_PATHS.COVERS}.${code}.${
    limitType.code === "manual" ? "limit" : "limit.code"
  }`;
  const [currencyCode, limit] = useWatch({
    name: [FORM_PATHS.CURRENCY_CODE, limitPath],
  });

  let suffix;
  switch (currencyCode) {
    case "USD":
      suffix = ` ${getNoun(limit, "доллара", "долларов", "долларов")}`;
      break;
    case "EUR":
      suffix = " евро";
      break;
    default:
  }

  return (
    <NumberFormat {...INTEGER_FORMAT_PROPS} suffix={suffix} value={limit} />
  );
};

const Description = ({ cover }) => {
  const { code } = cover;

  return (
    <div className="mt-2 small font-italic">
      {code === "tripCancel" && (
        <>
          В случае отмены поездки мы компенсируем расходы на покупку авиабилетов
          и/или бронь гостиницы в пределах <Limit cover={cover} /> на каждого
          застрахованного.
        </>
      )}
      {code === "luggage" &&
        "В случае гибели (утраты) багажа мы возместим причинённый ущерб в пределах указанной суммы."}
      {code === "accident" && (
        <>
          Мы произведем выплату в пределах <Limit cover={cover} /> на каждого
          путешественника при получении травмы, установлении инвалидности или
          смерти по страховому случаю в период поездки.
        </>
      )}
      {code === "civilLiability" && (
        <>
          При возникновении у вас гражданской ответственности мы произведем
          выплату в пределах <Limit cover={cover} /> 3-му лицу, для возмещения
          причиненного ему имущественного ущерба.
        </>
      )}
      {code === "estate" &&
        "Мы возместим документально подтвержденные расходы, связанные с повреждением квартиры, которое произошло во время вашего путешествия."}
    </div>
  );
};

export default Description;
