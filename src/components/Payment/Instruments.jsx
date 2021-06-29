import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { useFormContext, useWatch } from "react-hook-form";
import cn from "classnames";

import { FORM_PATHS } from "../../constants";
import styles from "./styles.module.scss";

const Instruments = ({ options }) => {
  const { setValue } = useFormContext();
  const code = useWatch({ name: FORM_PATHS.PAYMENT_INSTRUMENT_CODE });

  const categories = options.reduce((acc, currVal) => {
    const itemCategory = currVal.category || { code: "other", name: "Другой" };
    let categoryIndex = -1;
    for (let i = 0; i < acc.length; i++) {
      if (itemCategory.code === acc[i].code) {
        categoryIndex = i;
        break;
      }
    }
    if (categoryIndex !== -1) {
      acc[categoryIndex].items.push(currVal);
    } else {
      acc.push({
        code: currVal.category?.code,
        name: currVal.category?.name,
        items: [currVal],
      });
    }
    return acc;
  }, []);

  const onClick = (instrument) => () =>
    instrument.enable && setValue(FORM_PATHS.PAYMENT_INSTRUMENT, instrument);

  return categories.map((category) => {
    return (
      <div key={category.code}>
        <div className="my-2 text-muted">{category.name}</div>
        <div className="d-flex">
          {category.items.map((el) => {
            const selected = el.code === code;
            return (
              <div
                key={el.code}
                onClick={onClick(el)}
                className={cn(
                  "mr-2 position-relative border cursor-pointer user-select-none embed-responsive embed-responsive-16by9",
                  selected && "border-primary rounded-lg",
                  styles.wrapper
                )}
              >
                {selected && (
                  <div
                    className={cn(
                      "position-absolute text-primary",
                      styles.check
                    )}
                  >
                    <FontAwesomeIcon icon={faCheckDouble} />
                  </div>
                )}
                <div
                  className={cn(
                    "embed-responsive-item d-flex justify-content-center align-items-center",
                    styles.image
                  )}
                  style={{
                    backgroundImage: `url("${el.icon}")`,
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });
};

export default Instruments;
