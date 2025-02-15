import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Router } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagUpdate from "./TagUpdate";

import * as baseHooks from "app/base/hooks/base";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { Label as KernelOptionsLabel } from "app/tags/components/KernelOptionsField";
import tagURLs from "app/tags/urls";
import { Label } from "app/tags/views/TagDetails";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          id: 1,
          name: "rad",
        }),
      ],
    }),
  });
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [false, () => null]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches actions to fetch necessary data", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={tagURLs.tag.index(null, true)}
          component={() => <TagUpdate id={1} />}
        />
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [tagActions.fetch()];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("shows a spinner if the tag has not loaded yet", () => {
  const state = rootStateFactory({
    tag: tagStateFactory({
      items: [],
      loading: true,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <Route
          exact
          path={tagURLs.tag.index(null, true)}
          component={() => <TagUpdate id={1} />}
        />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("can update the tag", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <TagUpdate id={1} />
      </MemoryRouter>
    </Provider>
  );
  const nameInput = screen.getByRole("textbox", { name: Label.Name });
  userEvent.clear(nameInput);
  userEvent.type(nameInput, "name1");
  const commentInput = screen.getByRole("textbox", { name: Label.Comment });
  userEvent.clear(commentInput);
  userEvent.type(commentInput, "comment1");
  const optionsInput = screen.getByRole("textbox", {
    name: KernelOptionsLabel.KernelOptions,
  });
  userEvent.clear(optionsInput);
  userEvent.type(optionsInput, "options1");
  fireEvent.submit(screen.getByRole("form"));
  const expected = tagActions.update({
    id: 1,
    comment: "comment1",
    definition: "",
    kernel_opts: "options1",
    name: "name1",
  });
  await waitFor(() =>
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected)
  );
});

it("can return to the previous page on save", async () => {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: tagURLs.tags.index }],
  });
  history.push({
    pathname: tagURLs.tag.update({ id: 1 }),
    state: { canGoBack: true },
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={tagURLs.tag.update(null, true)}
          component={() => <TagUpdate id={1} />}
        />
      </Router>
    </Provider>
  );
  expect(history.location.pathname).toBe(tagURLs.tag.update({ id: 1 }));
  userEvent.type(screen.getByRole("textbox", { name: Label.Name }), "tag1");
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was updated.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(history.location.pathname).toBe(tagURLs.tags.index)
  );
});

it("goes to the tag details page if it can't go back", async () => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: tagURLs.tag.update({ id: 1 }),
      },
    ],
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route
          exact
          path={tagURLs.tag.update(null, true)}
          component={() => <TagUpdate id={1} />}
        />
      </Router>
    </Provider>
  );
  expect(history.location.pathname).toBe(tagURLs.tag.update({ id: 1 }));
  userEvent.type(screen.getByRole("textbox", { name: Label.Name }), "tag1");
  // Simulate the state.tag.saved state going from `save: false` to `saved:
  // true` which happens when the tag is successfully saved. This in turn will
  // mean that the form `onSuccess` prop will get called so that the component
  // knows that the tag was updated.
  jest
    .spyOn(baseHooks, "useCycled")
    .mockImplementation(() => [true, () => null]);
  fireEvent.submit(screen.getByRole("form"));
  await waitFor(() =>
    expect(history.location.pathname).toBe(tagURLs.tag.index({ id: 1 }))
  );
});
