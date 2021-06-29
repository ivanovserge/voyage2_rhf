import * as React from "react";
import { Tooltip } from "reactstrap";
import cn from "classnames";

const ErrorTooltip = React.forwardRef(
  ({ children, hidden, message, target, ...rest }, ref) => {
    const [hover, setHover] = React.useState(false);

    return (
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...rest}
      >
        {children}
        <Tooltip
          fade={false}
          innerClassName={cn("p-2 text-left")}
          isOpen={!hidden && hover && !!message}
          placement="top"
          modifiers={{ computeStyle: { x: "top" } }}
          target={target}
        >
          {message}
        </Tooltip>
      </div>
    );
  }
);

export default ErrorTooltip;
