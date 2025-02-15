import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { DeployFormValues } from "./types";

import FormikForm from "app/base/components/FormikForm";
import DeployFormFields from "app/settings/views/Configuration/DeployFormFields";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const DeploySchema = Yup.object().shape({
  default_osystem: Yup.string(),
  commissioning_distro_series: Yup.string(),
});

const DeployForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const defaultOSystem = useSelector(configSelectors.defaultOSystem);
  const defaultDistroSeries = useSelector(configSelectors.defaultDistroSeries);

  return (
    <FormikForm<DeployFormValues>
      buttonsAlign="left"
      buttonsBordered={false}
      initialValues={{
        default_osystem: defaultOSystem || "",
        default_distro_series: defaultDistroSeries || "",
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "Deploy form",
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saving={saving}
      saved={saved}
      validationSchema={DeploySchema}
    >
      <DeployFormFields />
    </FormikForm>
  );
};

export default DeployForm;
