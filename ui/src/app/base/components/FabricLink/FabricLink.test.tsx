import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FabricLink from "./FabricLink";

import subnetsURLs from "app/subnets/urls";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("handles when fabrics are loading", () => {
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [], loading: true }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricLink id={1} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByLabelText("Loading fabrics")).toBeInTheDocument();
});

it("handles when a fabric does not exist", () => {
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [], loading: false }),
  });
  const store = mockStore(state);
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricLink id={1} />
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeEmptyDOMElement();
});

it("renders a link if fabrics have loaded and it exists", () => {
  const fabric = fabricFactory();
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: [fabric], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <FabricLink id={fabric.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    subnetsURLs.fabric.index({ id: fabric.id })
  );
});
