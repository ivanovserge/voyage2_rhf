import * as React from "react";
import { Button } from "reactstrap";
import cn from "classnames";

import CalculateResult from "./CalculateResult";
import { useDebounce, useWidth } from "hooks";
import { ProductDataCtx } from "App";
import { DataCtx, ErrorCtx } from "components/Form/CalculationProvider";
import styles from "./styles.module.scss";

const Sidebar = ({ mobile, showInfo, toggleInfo }) => {
  const ref = React.useRef();
  const [top, setTop] = React.useState(0);
  const topDebounced = useDebounce(top, 50);
  const { down, up } = useWidth();
  const { info } = React.useContext(ProductDataCtx);
  const data = React.useContext(DataCtx);
  const error = React.useContext(ErrorCtx);

  React.useEffect(() => {
    const onMessage = (e) => {
      const { parentScroll } = e.data;
      if (
        parentScroll !== undefined &&
        ref.current?.children &&
        parentScroll + ref.current.children[0]?.clientHeight <
          window.innerHeight
      ) {
        setTop(parentScroll);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if ((mobile && up("md")) || (!mobile && down("md"))) {
    return null;
  }

  const props = {
    ref,
    className: mobile
      ? "mt-3"
      : cn(["position-absolute", styles.sidebarDesktop]),
  };
  if (!mobile) {
    props.style = { top: topDebounced };
  }

  return (
    <div {...props}>
      {!!data && (
        <div className="p-4 border border-grey rounded shadow">
          {error ? (
            <div className="small text-danger">{error}</div>
          ) : !!data[0].logic.warnings.length ? (
            data[0].logic.warnings.map(({ code, text }) => (
              <div key={code} className="small text-danger">
                {text}
              </div>
            ))
          ) : (
            <CalculateResult />
          )}
        </div>
      )}
      {!!info && !mobile && (
        <Button block className="mt-3" color="primary" onClick={toggleInfo}>
          {showInfo ? "Закрыть описание" : "Описание продукта"}
        </Button>
      )}
    </div>
  );
};

Sidebar.defaultProps = {
  mobile: false,
};

export default Sidebar;
