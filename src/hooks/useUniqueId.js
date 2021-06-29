import * as React from "react";
import uniqueId from "lodash.uniqueid";

const useUniqueId = (prefix = "id-") => {
  const [id] = React.useState(() => uniqueId(prefix));
  return id;
};

export default useUniqueId;
