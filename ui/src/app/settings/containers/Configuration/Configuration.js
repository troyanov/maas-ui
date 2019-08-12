import React from "react";
import { useSelector } from "react-redux";

import selectors from "app/settings/selectors";
import GeneralForm from "app/settings/components/GeneralForm";

const Configuration = () => {
  const loaded = useSelector(selectors.config.loaded);

  return <>{loaded && <GeneralForm />}</>;
};

export default Configuration;
