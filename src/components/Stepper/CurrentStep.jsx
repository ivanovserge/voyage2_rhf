import * as React from "react";

const CurrentStep = ({ children, index, sidebar }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    if (ref.current && index && window.parentIFrame) {
      const top = ref.current.getBoundingClientRect().top;
      window.parentIFrame.getPageInfo(() => {
        window.parentIFrame.getPageInfo(false);
        window.parentIFrame.scrollToOffset(0, top - 18);
      });
    }
    return () => {
      if (window.parentIFrame) {
        window.parentIFrame.getPageInfo(false);
      }
    };
  }, [index]);

  return (
    <div ref={ref}>
      <div className="h5 font-weight-light mb-0 WizardSectionTitleOpen">
        {children.props.title}
      </div>
      {sidebar}
      {children}
      <hr />
    </div>
  );
};

export default CurrentStep;
