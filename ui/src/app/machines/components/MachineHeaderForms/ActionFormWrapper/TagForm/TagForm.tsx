import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import TagFormFields from "./TagFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { MachineActionFormProps } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import { NodeActions } from "app/store/types/node";

type Props = MachineActionFormProps;

export type TagFormValues = {
  tags: string[];
};

const TagFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(Yup.string())
    .min(1)
    .required("You must select at least one tag."),
});

export const TagForm = ({
  clearHeaderContent,
  errors,
  machines,
  processingCount,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<TagFormValues>({
    tags: [],
  });
  const tagsLoaded = useSelector(tagSelectors.loaded);

  let formErrors: Record<string, string | string[]> | null = null;
  if (errors && typeof errors === "object" && "name" in errors) {
    formErrors = {
      ...errors,
      tags: errors.name,
    } as Record<string, string | string[]>;
    delete formErrors.name;
  }

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm<TagFormValues>
      actionName={NodeActions.TAG}
      cleanup={machineActions.cleanup}
      errors={formErrors}
      initialValues={initialValues}
      loaded={tagsLoaded}
      modelName="machine"
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Tag",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        if (values.tags && values.tags.length) {
          machines.forEach((machine) => {
            dispatch(
              machineActions.tag({
                systemId: machine.system_id,
                tags: values.tags,
              })
            );
          });
        }
        setInitialValues(values);
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      submitLabel="Save"
      selectedCount={machines.length}
      validationSchema={TagFormSchema}
    >
      <TagFormFields machines={machines} />
    </ActionForm>
  );
};

export default TagForm;
