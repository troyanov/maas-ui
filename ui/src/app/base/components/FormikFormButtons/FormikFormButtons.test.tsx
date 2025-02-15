import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";

import FormikFormButtons from "./FormikFormButtons";

it("can display a cancel button", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons onCancel={jest.fn()} submitLabel="Save user" />
    </Formik>
  );
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

it("can perform a secondary submit action if function and label provided", () => {
  const secondarySubmit = jest.fn();
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons
        submitLabel="Save user"
        secondarySubmit={secondarySubmit}
        secondarySubmitLabel="Save and add another"
      />
    </Formik>
  );
  expect(screen.getByTestId("secondary-submit")).toHaveTextContent(
    "Save and add another"
  );
  userEvent.click(screen.getByRole("button", { name: "Save and add another" }));
  expect(secondarySubmit).toHaveBeenCalled();
});

it("can generate a secondary submit label via a function", () => {
  const secondarySubmit = jest.fn();
  render(
    <Formik initialValues={{ name: "Koala" }} onSubmit={jest.fn()}>
      <FormikFormButtons
        submitLabel="Save user"
        secondarySubmit={secondarySubmit}
        secondarySubmitLabel={({ name }) => `Kool ${name}`}
      />
    </Formik>
  );
  expect(screen.getByTestId("secondary-submit")).toHaveTextContent(
    "Kool Koala"
  );
  userEvent.click(screen.getByRole("button", { name: "Kool Koala" }));
  expect(secondarySubmit).toHaveBeenCalled();
});

it("can display a tooltip for the secondary submit action", async () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons
        submitLabel="Save user"
        secondarySubmit={jest.fn()}
        secondarySubmitLabel="Save and add another"
        secondarySubmitTooltip="Will add another"
      />
    </Formik>
  );
  expect(screen.queryByText("Will add another")).not.toBeInTheDocument();
  userEvent.hover(screen.getByRole("button", { name: "Save and add another" }));
  expect(screen.getByText("Will add another")).toBeInTheDocument();
});

it("displays a border if bordered is true", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons buttonsBordered submitLabel="Save" />
    </Formik>
  );

  expect(screen.getByTestId("buttons-wrapper")).toHaveClass("is-bordered");
});

it("displays inline if inline is true", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons inline submitLabel="Save" />
    </Formik>
  );
  expect(screen.getByTestId("buttons-wrapper")).toHaveClass("is-inline");
});

it("displays help text if provided", () => {
  const buttonsHelp = <p>Help!</p>;
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons buttonsHelp={buttonsHelp} submitLabel="Save" />
    </Formik>
  );
  expect(screen.getByTestId("buttons-help")).toBeInTheDocument();
  expect(screen.getByTestId("buttons-help")).toHaveTextContent("Help!");
});

it("can fire custom onCancel function", () => {
  const onCancel = jest.fn();
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons onCancel={onCancel} submitLabel="Save" />
    </Formik>
  );
  userEvent.click(screen.getByTestId("cancel-action"));
  expect(onCancel).toHaveBeenCalled();
});

it("can display a saving label", () => {
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <FormikFormButtons saving savingLabel="Be patient!" submitLabel="Save" />
    </Formik>
  );
  expect(screen.getByTestId("saving-label")).toHaveTextContent("Be patient!");
});
