import { useEffect, useState } from "react";

import { Col, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useSendAnalytics } from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { CreateParams, Tag } from "app/store/tag/types";
import DefinitionField from "app/tags/components/DefinitionField";
import KernelOptionsField from "app/tags/components/KernelOptionsField";
import tagsURLs from "app/tags/urls";

type Props = {
  onClose: () => void;
};

export enum Label {
  Comment = "Comment",
  Name = "Tag name",
}

const AddTagFormSchema = Yup.object().shape({
  comment: Yup.string(),
  definition: Yup.string(),
  kernel_opts: Yup.string(),
  name: Yup.string().required("Name is required."),
});

export const AddTagForm = ({ onClose }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [savedName, setSavedName] = useState<Tag["name"] | null>(null);
  const saved = useSelector(tagSelectors.saved);
  const saving = useSelector(tagSelectors.saving);
  const errors = useSelector(tagSelectors.errors);
  const tag = useSelector((state: RootState) =>
    // Tag names are unique so fetch the newly created tag using the name
    // provided in this form.
    tagSelectors.getByName(state, savedName)
  );
  const sendAnalytics = useSendAnalytics();

  useEffect(() => {
    if (tag) {
      history.push({ pathname: tagsURLs.tag.index({ id: tag.id }) });
      if (tag.definition) {
        sendAnalytics("XPath tagging", "Valid XPath", "Save");
      } else {
        sendAnalytics("Create Tag form", "Manual tag created", "Save");
      }
      onClose();
    }
  }, [history, onClose, tag, sendAnalytics]);

  return (
    <FormikForm<CreateParams>
      aria-label="Create tag"
      buttonsAlign="right"
      buttonsBordered={true}
      cleanup={tagActions.cleanup}
      errors={errors}
      initialValues={{
        comment: "",
        definition: "",
        kernel_opts: "",
        name: "",
      }}
      onCancel={onClose}
      onSubmit={(values) => {
        dispatch(tagActions.cleanup());
        dispatch(tagActions.create(values));
      }}
      onSuccess={({ name }) => {
        setSavedName(name);
      }}
      saved={saved}
      saving={saving}
      submitLabel="Save"
      validationSchema={AddTagFormSchema}
    >
      <Row>
        <Col size={6}>
          <FormikField
            label={Label.Name}
            name="name"
            placeholder="Enter a name for the tag."
            type="text"
            required
          />
          <FormikField
            label={Label.Comment}
            name="comment"
            placeholder="Add a comment as an explanation for this tag."
            type="text"
          />
          <KernelOptionsField />
        </Col>
        <Col size={6}>
          <DefinitionField />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddTagForm;
