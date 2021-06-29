import CountUp from "react-countup";
import cn from "classnames";

import styles from "./Currency.module.scss";

const Currency = ({ className, name, value, ...rest }) => {
  return (
    <CountUp
      className={cn("premiumCurrencyPrice", styles.currency, className)}
      decimal="<sup class='dec'>"
      decimals={2}
      duration={0.5}
      end={value}
      preserveValue
      separator=" "
      suffix={`</sup> <span class='cur font-weight-normal'>${name}</span><span class='logicPanelCur font-weight-normal'/>`}
      {...rest}
    />
  );
};

Currency.defaultProps = {
  name: "руб.",
};

export default Currency;
