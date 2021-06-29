import * as React from "react";

const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

const useWidth = () => {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const down = (point) => width < BREAKPOINTS[point];
  const up = (point) => width >= BREAKPOINTS[point];

  return { width, down, up };
};

export default useWidth;
